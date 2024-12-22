from flask import Flask, request, jsonify
from flask_cors import CORS
from main import process_travel_plan
import os

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept", "Authorization"],
        "supports_credentials": False
    }
})

# 用于存储修改历史的字典
modification_history = {}

@app.route('/update_travel_plan', methods=['POST'])
def update_travel_plan():
    print("收到请求，请求数据:", request.json)  # 添加请求日志
    try:
        # 获取请求数据
        data = request.json
        user_prompt = data.get('message', '')  # 改为与api.py一致的参数名
        session_id = data.get('session_id', 'default')
        
        # 初始化修改历史
        if session_id not in modification_history:
            modification_history[session_id] = []
            
        # 调用处理函数
        result = process_travel_plan(user_prompt)
        
        # 添加到修改历史
        modification_history[session_id].append({
            "prompt": user_prompt,
            "result": result
        })
        
        # 构建响应格式，与api.py保持一致
        response = {
            "reply": result["reply"],
            "status": "success",
            "session_id": session_id
        }
        
        print("准备发送响应:", response)  # 添加响应日志
        return jsonify(response)
    
    except Exception as e:
        print(f"处理请求时发生错误: {str(e)}")  # 添加错误日志
        return jsonify({
            "reply": f"服务器处理请求时发生错误: {str(e)}",
            "status": "error",
            "session_id": data.get('session_id', 'default')
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)  # 使用不同端口避免冲突
  