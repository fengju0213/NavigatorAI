import requests

url = "http://localhost:5000/chat"
session_id = "user"  # 可以是任何唯一标识符

def send_message(message, npc_name):
    data = {"message": message, "session_id": session_id, "npc_name": npc_name}
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("user:", message)
        print("agent:", response.json()['reply'])
        if 'function_call' in response.json():
            print("function_call:", response.json()['function_call'])
        if 'function_result' in response.json():
            print("function_result:", response.json()['function_result'])
        print("---")
    else:
        print("error:", response.status_code, response.text)

# 测试对话
print("与agent的对话:")
send_message("你好", "agent")
#send_message("帮我看看这个图片, https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen-VL/assets/demo.jpeg,", "agent")