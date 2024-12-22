"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useRef } from "react"
import { Message } from "@/types"

interface ChatMessagesProps {
  messages: Message[]
  isGenerating: boolean
  onStopGeneration: () => void
}

const initialMessage: Message = {
  id: "initial",
  content: "你好，我是Navigator，一个旅行规划助手，你可以告诉我你想去的旅游的城市和计划的出行时间，我来为你生成一份精美的旅游规划。",
  isUser: false
}

export function ChatMessages({ messages, isGenerating, onStopGeneration }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="max-w-2xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className={`flex items-start gap-3 justify-start`}>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className={`max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100`}>
              {initialMessage.content}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              {!message.isUser && (
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
              >
                {message.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              {message.isUser && (
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
        {isGenerating && (
          <div className="flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 mr-2">正在努力规划中...</p>
            <Button variant="outline" size="sm" onClick={onStopGeneration}>
              Stop Generation
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

