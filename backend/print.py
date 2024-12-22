# 在桌面上创建一个test.txt文件
# 1. 获取桌面路径
# 2. 创建文件

import os

# 获取桌面路径
desktop_path = "C:/Users/YUI/Desktop"

# 在桌面上创建文件的完整路径
file_path = os.path.join(desktop_path, 'test.txt')

# 创建并写入文件
try:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('这是测试文件内容\n')
        f.write('Hello World!\n')
    print(f'文件已成功创建在: {file_path}')
except Exception as e:
    print(f'创建文件时发生错误: {e}')
