"use client"

import { Card } from "@/components/ui/card"
import { FilePreviewControls } from "./file-preview-controls"
import { useState, useEffect } from "react"
import { ChevronDown, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface FileItem {
  name: string
  path: string
}

export function FileSidebar() {
  const [selectedFile, setSelectedFile] = useState<string>('/CAMEL旅游规划助手.pdf')
  const [isOpen, setIsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([])

  // 获取 public 目录下的所有 PDF 文件
  useEffect(() => {
    async function fetchPDFFiles() {
      try {
        const response = await fetch('/api/files')
        const data = await response.json()
        const pdfFiles = data.files
          .filter((file: string) => file.endsWith('.pdf'))
          .map((file: string) => ({
            name: file.replace('.pdf', ''),
            path: `/${file}`
          }))
        setFiles(pdfFiles)
      } catch (error) {
        console.error('Error fetching PDF files:', error)
      }
    }
    fetchPDFFiles()
  }, [])

  const handleDownload = () => {
    const previewElement = document.getElementById('file-preview') as HTMLIFrameElement
    if (previewElement && previewElement.src) {
      const link = document.createElement('a')
      link.href = previewElement.src
      const fileName = previewElement.src.split('/').pop() || 'downloaded-file'
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className={`relative flex flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[400px]'}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute -left-4 top-4 z-50 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 p-0"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {!isCollapsed && (
        <>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Files</h2>
          </div>
          <div className="relative h-[calc(100vh-65px)]">
            <div className="p-4">
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span>Available Files</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1">
                  <ScrollArea className="h-[200px] pr-4">
                    {files.map((file) => (
                      <button
                        key={file.path}
                        className={`flex items-center gap-2 w-full p-2 text-sm rounded-lg transition-colors mb-1 ${
                          selectedFile === file.path 
                            ? 'bg-gray-200 dark:bg-gray-600' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedFile(file.path)}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{file.name}</span>
                      </button>
                    ))}
                  </ScrollArea>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <Card className="m-4">
              <div className="text-sm font-medium p-4 border-b border-gray-200 dark:border-gray-700">
                Preview
              </div>
              <div className="relative">
                <iframe
                  id="file-preview"
                  className="w-full h-[calc(100vh-280px)]"
                  src={selectedFile}
                  style={{ border: 'none' }}
                />
                <FilePreviewControls 
                  onDownload={handleDownload} 
                  currentFile={selectedFile.split('/').pop() || ''}
                />
              </div>
            </Card>
          </div>
        </>
      )}
      
      {isCollapsed && (
        <div className="flex flex-col items-center py-4">
          <FileText className="h-6 w-6 text-gray-500" />
        </div>
      )}
    </div>
  )
}

