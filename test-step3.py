import requests

url = "http://127.0.0.1:5000/generate_itinerary_html"
payload = {"city": "成都", "days": "3"}

response = requests.post(url, json=payload)
print("状态码:", response.status_code)

# 返回的就是一整段 HTML 文本
html_content = response.text

# 你可以把它写进 .html 文件，然后在浏览器打开
with open("mytrip.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("已生成 mytrip.html")
