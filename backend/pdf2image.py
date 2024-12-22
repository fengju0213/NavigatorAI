import fitz
import os
from PIL import Image

def convert_pdf_to_images(pdf_path, output_dir, zoom=2.0):
    """
    使用PyMuPDF将PDF文件转换为图片
    
    参数:
        pdf_path (str): PDF文件的路径
        output_dir (str): 输出图片的目录
        zoom (float): 缩放系数，值越大图片质量越高，默认2.0
    
    返回:
        list: 保存的图片文件路径列表
    """
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 打开PDF文件
    pdf = fitz.open(pdf_path)
    
    # 保存每页的图片
    image_paths = []
    for page_num in range(pdf.page_count):
        # 获取当前页面
        page = pdf[page_num]
        
        # 设置缩放系数，值越大分辨率越高
        matrix = fitz.Matrix(zoom, zoom)
        
        # 获取页面的像素图
        pix = page.get_pixmap(matrix=matrix)
        
        # 生成输出文件名
        output_file = os.path.join(output_dir, f'page_{page_num+1}.png')
        
        # 保存图片
        pix.save(output_file)
        image_paths.append(output_file)
    
    # 关闭PDF文件
    pdf.close()
    
    return image_paths

def convert_pdf_to_single_image(pdf_path, output_path, zoom=2.0):
    """
    使用PyMuPDF将PDF文件转换为单张图片
    
    参数:
        pdf_path (str): PDF文件的路径
        output_path (str): 输出图片的路径
        zoom (float): 缩放系数，值越大图片质量越高，默认2.0
    
    返回:
        str: 保存的图片文件路径
    """
    # 打开PDF文件
    pdf = fitz.open(pdf_path)
    
    # 创建一个列表存储所有页面的图片
    images = []
    total_height = 0
    max_width = 0
    
    # 转换每一页并获取尺寸信息
    for page_num in range(pdf.page_count):
        page = pdf[page_num]
        matrix = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=matrix)
        
        # 将 PyMuPDF 的像素图转换为 PIL Image
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        images.append(img)
        
        # 更新总高度和最大宽度
        total_height += img.height
        max_width = max(max_width, img.width)
    
    # 创建一个新的空白图片
    combined_image = Image.new('RGB', (max_width, total_height), 'white')
    
    # 垂直拼接所有图片
    current_height = 0
    for img in images:
        # 将图片水平居中
        x_offset = (max_width - img.width) // 2
        combined_image.paste(img, (x_offset, current_height))
        current_height += img.height
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 保存合并后的图片
    combined_image.save(output_path, 'PNG')
    
    # 关闭PDF文件
    pdf.close()
    
    return output_path

# 使用示例
if __name__ == "__main__":
    pdf_file = "test4.pdf"
    output_folder = "output_images"
    
    image_files = convert_pdf_to_images(pdf_file, output_folder)
    print(f"转换完成！共生成 {len(image_files)} 个图片文件")
    for image_file in image_files:
        print(f"已保存: {image_file}")

    pdf_file = "test4.pdf"
    output_file = "output_images/combined.png"
    
    image_file = convert_pdf_to_single_image(pdf_file, output_file)
    print(f"转换完成！已保存为单张图片：{image_file}")
