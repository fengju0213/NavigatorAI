import os
from flask import Flask, request, jsonify
from autogen import ConversableAgent, UserProxyAgent
import json
import requests
import base64
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept", "Authorization"],
        "supports_credentials": False
    }
})

# LLM配置
config_list = [
    {
        "model": "gpt-4o",
        "base_url": "Your_LLM_BaseUrl",
        "api_key": "your-Api-Key",
    }
]

SYSTEM_PROMPT = f"""
你叫NavigatorAI，一个旅行规划助手，你需要和用户对话来获取用户的计划前往旅游的城市和和出行时间，从而调用一系列工具为其生成一份精美的旅游攻略。
首先你一定要先询问用户计划前往旅游的城市和和出行时间，然后根据用户提供的信息为其生成一份精美的旅游攻略。
"""

# 定义tool_use
def analyze_image_general(image_source):
    """分析图片内容并返回描述"""
    try:
        # 判断是否为URL
        if image_source.startswith(('http://', 'https://')):
            response = requests.get(image_source)
            base64_image = base64.b64encode(response.content).decode('utf-8')
        else:
            with open(image_source, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            base_url=os.getenv('OPENAI_BASE_URL')
        )
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "描述一下图片中的内容"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300,
        )
        
        return json.dumps({
            "action": "analyze_image_general", 
            "source": image_source,
            "result": response.choices[0].message.content
        })
        
    except Exception as e:
        return json.dumps({
            "action": "analyze_image_general",
            "source": image_source,
            "error": str(e)
        })

def jina_search(query):
    """使用在线搜索"""
    try:
        url = f'https://s.jina.ai/{query}'
        headers = {
            'Authorization': 'Bearer jina_284b019f5fdc4a05a23c5ee7a04b6ce3NNXx74hnL8LQVKuC745tjKYzJpnp',
            "X-With-Generated-Alt": "true"
        }
        
        response = requests.get(url, headers=headers)
        
        # 保存搜索结果到文件
        if not os.path.exists('./online/search'):
            os.makedirs('./online/search', exist_ok=True)
            
        existing_files = [f for f in os.listdir('./online/search') if f.startswith('article_') and f.endswith('.md')]
        next_number = len(existing_files) + 1
        
        output_path = f'./online/search/article_{next_number}.md'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(response.text)
            
        return json.dumps({
            "action": "jina_search",
            "query": query,
            "result": f"搜索结果已保存到 {output_path}",
            "content": response.text[:100] + "..." # 返回前100个字符作为预览
        })
        
    except Exception as e:
        return json.dumps({
            "action": "jina_search",
            "query": query,
            "error": str(e)
        })

# 定义可用的函数
functions = [
    {
        "name": "analyze_image_general",
        "description": "分析图片内容并返回描述",
        "parameters": {
            "type": "object",
            "properties": {
                "image_source": {
                    "type": "string", 
                    "description": "图片的本地路径或URL地址"
                }
            },
            "required": ["image_source"]
        }
    },
    {
        "name": "jina_search",
        "description": "使用在线搜索获取知识",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "搜索查询关键词"
                }
            },
            "required": ["query"]
        }
    }
]

# 定义医生agent
agent = ConversableAgent(
    name="agent",
    system_message=SYSTEM_PROMPT,
    human_input_mode="NEVER",
    llm_config={
        "config_list": config_list,
        "timeout": 180,
        "temperature": 0.0,
        "functions": functions,
    }
)

# 创建agent字典
npc_agents = {
    "agent": agent,
}

# 创建用户代理
user = UserProxyAgent(
    name="user",
    human_input_mode="NEVER",
    code_execution_config={"use_docker": False}
)

# 用于存储对话历史的字典
conversation_history = {}

@app.route('/chat', methods=['POST'])
def chat():
    print("收到请求，请求数据:", request.json)  # 添加请求日志
    data = request.json
    user_message = data.get('message', '')
    session_id = data.get('session_id', 'default')
    npc_name = data.get('npc_name', 'agent')

    if npc_name not in npc_agents:
        return jsonify({"error": "Invalid NPC name"}), 400

    current_agent = npc_agents[npc_name]

    # 初始化对话历史
    if session_id not in conversation_history:
        conversation_history[session_id] = {}
    if npc_name not in conversation_history[session_id]:
        conversation_history[session_id][npc_name] = []

    # 添加用户消息到对话历史
    conversation_history[session_id][npc_name].append({"role": "user", "content": user_message})

    # 重置agent和user的对话状态
    current_agent.reset_consecutive_auto_reply_counter(user)
    user.reset_consecutive_auto_reply_counter(current_agent)
    current_agent.reply_at_receive[user] = True

    try:
        # 构建消息历史，过滤掉null值
        messages = [
            {"role": "system", "content": current_agent.system_message}
        ] + [
            msg for msg in conversation_history[session_id][npc_name]
            if msg.get('content') is not None
        ]

        # 发送用户消息并获取回复
        reply = current_agent.generate_reply(messages=messages, sender=user)

        function_call = None
        function_result = None
        reply_content = ''

        if isinstance(reply, dict) and 'function_call' in reply:
            function_call = reply['function_call']
            function_name = function_call['name']
            arguments = json.loads(function_call['arguments'])
            
            # 执行函数调用
            if function_name == 'analyze_image_general':
                function_result = analyze_image_general(arguments['image_source'])
            elif function_name == 'jina_search':
                function_result = jina_search(arguments['query'])
            else:
                function_result = json.dumps({"error": "未知的函数调用"})

            print(f"执行动作: {function_result}")
            
            # 将function_result解析为字典
            result_dict = json.loads(function_result)
            
            # 使用result字段作为content
            reply_content = result_dict.get('result', '执行了一个动作，但没有具体结果。')
            
        elif isinstance(reply, dict):
            reply_content = reply.get('content', '')
        else:
            reply_content = reply

        # 确保reply_content不为空
        if not reply_content:
            reply_content = "对不起，我现在无法回答。让我们换个话题吧。"

        # 添加agent的回复到对话历史
        conversation_history[session_id][npc_name].append({"role": "assistant", "content": reply_content})

        # 构建响应
        response = {
            'reply': reply_content,
            'function_call': function_call,
            'function_result': function_result
        }

        print("准备发送响应:", response)  # 添加响应日志
        return jsonify(response)

    except Exception as e:
        print(f"处理请求时发生错误: {str(e)}")  # 添加错误日志
        return jsonify({"error": f"An internal error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)