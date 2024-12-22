import openai
import base64
from html2pdf import convert_html_to_pdf
from pdf2image import convert_pdf_to_images
import os
import subprocess
import re

def extract_html_content(llm_response):
    """提取LLM响应中的HTML代码部分"""
    if '```html' in llm_response:
        # 找到html代码块的开始和结束
        start_index = llm_response.find('```html') + 7  # 7是'```html'的长度
        end_index = llm_response.find('```', start_index)
        if end_index != -1:
            return llm_response[start_index:end_index].strip()
    return llm_response  # 如果没找到标记，返回原始内容

def process_travel_plan(user_prompt):
    try:
        path = "C:/Users/YUI/Desktop/navigator/frontend/public"
        temp_image_path = "C:/Users/YUI/Desktop/navigator/frontend/public/output_images"
        
        # 读取desktop下所有pdf后缀的文件名
        pdf_files = [f for f in os.listdir(path) if f.lower().endswith('.pdf')]

        if not pdf_files:
            return {"reply": "未找到PDF文件"}

        # 获取第一个PDF文件
        file_name = pdf_files[0]
        base_name = os.path.splitext(file_name)[0]

        def encode_image(image_path):
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')

        # 转换PDF为多张图片
        image_paths = convert_pdf_to_images(
            os.path.join(path, file_name),
            temp_image_path
        )

        system_prompt = """
        你是NavigatorAI，一个旅行规划方案修改助手。
        用户可能会在规划中使用批注或者画圈的方式对你的规划进行反馈，你需要精准识别出用户希望更改的内容并根据用户的反馈对旅行规划进行调整。
        你需要耐心倾听用户的需求，并反馈进行调整，直到用户满意为止。
        """

        # 读取 HTML 文件内容
        with open('C:/Users/YUI/Desktop/navigator/backend/beijing.html', 'r', encoding='utf-8') as file:
            html_content = file.read()

        user_input = "原始的html代码如下" + html_content + "请根据用户在图片中的批注和反馈内容直接输出新的html代码"

        # 对所有图片进行base64编码
        image_base64_list = [encode_image(image_path) for image_path in image_paths]

        # 动态构建messages中的image_url列表
        image_messages = [
            {"type": "text", "text": user_input}
        ]
        for base64_str in image_base64_list:
            image_messages.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/png;base64,{base64_str}"
                }
            })
        image_messages.append({"type": "text", "text": user_prompt})

        client = openai.OpenAI(
            api_key="Your_API_key",
            base_url="Your_LLM_BaseUrl",
        )

        response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.0,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": image_messages}
            ],
        )

        content = response.choices[0].message.content
        # 添加后处理步骤
        html_content = extract_html_content(content)

        # 保存为新的html文件
        output_filename = f"{base_name}.html"
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(html_content)  # 使用处理后的HTML内容

        # 转换为PDF
        pdf_output = os.path.join(path, f"{base_name}.pdf")
        convert_html_to_pdf(html_file_path=output_filename, pdf_file_path=pdf_output)

        return {
            "reply": "哈咯咯，已成功根据您的要求修改了旅游攻略，请查收！"
        }

    except Exception as e:
        return {
            "reply": f"处理过程中发生错误: {str(e)}"
        }

# 使用示例
if __name__ == "__main__":
    result = process_travel_plan("我想把这部分画红圈的行程修改一下")
    print(result)