import subprocess

md_file_path = 'C:/Users/YUI/Desktop/navigator/backend/output.md'  # Markdown文件路径

def convert_md_to_pdf_with_pandoc(md_file_path, pdf_file_path, css_file_path):
    try:
        subprocess.run([
            'pandoc', 
            '-s', 
            md_file_path, 
            '-o', 
            pdf_file_path, 
            '--css', 
            css_file_path,
            '--pdf-engine=wkhtmltopdf',
            '--pdf-engine-opt=--enable-local-file-access',  # 允许访问本地文件
            '--variable=margin-top:0',
            '--variable=margin-bottom:0',
            '--variable=margin-left:0',
            '--variable=margin-right:0'  # 所有边距设为0
        ], check=True)
        print(f"文件 {md_file_path} 已成功转换为PDF并保存为 {pdf_file_path}")
    except subprocess.CalledProcessError as e:
        print(f"转换过程中发生错误: {e}")


def convert_html_to_pdf(html_file_path, pdf_file_path):
    try:
        subprocess.run([
            'wkhtmltopdf',
            html_file_path,
            pdf_file_path
        ], check=True)
        print(f"HTML文件 {html_file_path} 已成功转换为PDF并保存为 {pdf_file_path}")
    except subprocess.CalledProcessError as e:
        print(f"转换过程中发生错误: {e}")

if __name__ == '__main__':
    # HTML转PDF
    html_file_path = 'C:/Users/YUI/Desktop/navigator/backend/output.html'
    pdf_file_path = 'C:/Users/YUI/Desktop/navigator/backend/html.pdf'
    convert_html_to_pdf(html_file_path, pdf_file_path)
    
    # # Markdown转PDF（原有功能保留）
    # css_file_path = 'C:/Users/YUI/Desktop/navigator/backend/github.css'
    # convert_md_to_pdf_with_pandoc(md_file_path, pdf_file_path, css_file_path)