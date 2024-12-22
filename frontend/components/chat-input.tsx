"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal, Mic } from 'lucide-react'
import { useState, useEffect } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled: boolean
  canEdit: boolean
  initialMessage: string
}

export function ChatInput({ onSendMessage, disabled, canEdit, initialMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    if (canEdit) {
      setMessage(initialMessage)
    }
  }, [canEdit, initialMessage])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks)
        // 这里需要调用语音识别 API，这里用一个模拟的例子
        // 实际使用时可以替换成真实的语音识别服务
        setMessage("语音输入的文字") // 替换成实际的识别结果
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // 5秒后自动停止录音
      setTimeout(() => {
        mediaRecorder.stop()
        setIsRecording(false)
      }, 5000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="relative max-w-2xl mx-auto">
        <Textarea
          placeholder="Type your message..."
          className="min-h-[60px] resize-none pr-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          disabled={disabled}
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            onClick={startRecording}
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            onClick={handleSend}
            disabled={disabled}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

