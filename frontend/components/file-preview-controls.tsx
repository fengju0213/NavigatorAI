"use client"

import { Button } from "@/components/ui/button"
import { Download, Maximize2, Minimize2, Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface FilePreviewControlsProps {
  onDownload: () => void
  currentFile: string
}

export function FilePreviewControls({ onDownload, currentFile }: FilePreviewControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const previewElement = document.getElementById('file-preview')
      if (previewElement) {
        previewElement.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSaveAnnotations = async () => {
    try {
      const previewElement = document.getElementById('file-preview') as HTMLIFrameElement
      if (!previewElement?.contentWindow) return

      // 获取 PDF 查看器的当前状态
      const pdfViewer = previewElement.contentWindow.PDFViewerApplication
      if (!pdfViewer) {
        toast.error("无法访问 PDF 查看器")
        return
      }

      // 获取带注释的 PDF 数据
      const data = await pdfViewer.pdfDocument.saveDocument()
      
      // 发送到服务器保存
      const response = await fetch('/api/files/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: currentFile,
          data: Array.from(data)
        })
      })

      if (response.ok) {
        toast.success("保存成功！")
      } else {
        throw new Error("保存失败")
      }
    } catch (error) {
      console.error('Error saving annotations:', error)
      toast.error("保存失败，请重试")
    }
  }

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleSaveAnnotations}
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
} 