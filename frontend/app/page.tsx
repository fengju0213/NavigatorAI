"use client"

import { useState, useEffect, useRef } from "react"
import { ChatHeader } from "@/components/chat-header"
import { ChatInput } from "@/components/chat-input"
import { ChatMessages } from "@/components/chat-messages"
import { Sidebar } from "@/components/sidebar"
import { FileSidebar } from "@/components/file-sidebar"
import { Chat, Message, ChatState, UserProfile } from "@/types"
import { v4 as uuidv4 } from 'uuid'
import { StageSelector } from "@/components/server-selector"

const CHATS_STORAGE_KEY = 'navigator_chats'

// 导入或定义初始消息
const initialMessage: Message = {
  id: "initial",
  content: "你好，我是Navigator，一个旅行规划助手，你可以告诉我你想去的旅游的城市和计划的出行时间，我来为你生成一份精美的旅游规划。",
  isUser: false
}

interface ChatResponse {
  reply: string
  function_call?: string
  function_result?: string
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>('')
  const [chatState, setChatState] = useState<ChatState>({
    isGenerating: false,
    canEditLastMessage: false
  })
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: '',
    mbti: '',
    income: '',
    companions: '1',
    targetCity: '',
    travelDateFrom: '',
    travelDateTo: ''
  })
  
  const generationController = useRef<AbortController | null>(null)

  const [currentServer, setCurrentServer] = useState<string>(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  )

  const [currentStage, setCurrentStage] = useState<string>('Stage 1')

  useEffect(() => {
    const storedChats = localStorage.getItem(CHATS_STORAGE_KEY)
    if (storedChats) {
      setChats(JSON.parse(storedChats))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    if (chats.length === 0) {
      const newChatId = uuidv4()
      const newChat: Chat = {
        id: newChatId,
        title: 'New Chat',
        messages: [],
        timestamp: new Date().toISOString()
      }
      setChats([newChat])
      setCurrentChatId(newChatId)
    }
  }, [])

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      timestamp: new Date().toLocaleString(),
      messages: [{
        id: "initial",
        content: "你好，我是Navigator，一个旅行规划助手，你可以告诉我你想去的旅游的城市和计划的出行时间，我来为你生成一份精美的旅游规划。",
        isUser: false
      }]
    }
    setChats(prevChats => [newChat, ...prevChats])
    setCurrentChatId(newChat.id)
  }

  const selectChat = (id: string) => {
    setCurrentChatId(id)
  }

  const addMessage = async (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      isUser
    }

    // 更新消息列表
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage]
            }
          : chat
      )
    )

    // 如果是用户消息，则获取AI响应
    if (isUser) {
      try {
        setChatState({ isGenerating: true, canEditLastMessage: false })
        await simulateAIResponse(content)  // 传入用户消息内容
      } catch (error) {
        console.error('Error getting AI response:', error)
        setChatState({ isGenerating: false, canEditLastMessage: true })
      }
    }
  }

  const simulateAIResponse = async (userMessage: string) => {
    try {
      const controller = new AbortController()
      generationController.current = controller

      const requestData = {
        message: userMessage,
        session_id: currentChatId,
        npc_name: "agent"
      }

      console.log('正在发送请求:', requestData)
      console.log('当前服务器:', currentServer)

      const response = await fetch(`${currentServer}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      })

      // 先获取响应文本
      const responseText = await response.text()
      console.log('收到响应状态:', response.status)
      console.log('响应内容:', responseText)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`)
      }

      // 尝试解析JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      console.log('解析后的响应数据:', data)

      // 检查是否被中止
      if (!controller.signal.aborted) {
        if (data.reply) {
          // 直接添加AI的回复消息
          const newMessage: Message = {
            id: uuidv4(),
            content: data.reply,
            isUser: false
          }
          
          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    messages: [...chat.messages, newMessage]
                  }
                : chat
            )
          )
        } else {
          throw new Error(`Invalid response format: ${JSON.stringify(data)}`)
        }
      }
    } catch (error) {
      console.error('请求错误:', error)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('生成已停止')
        } else {
          // 添加错误消息
          const errorMessage: Message = {
            id: uuidv4(),
            content: `抱歉，发生了错误：${error.message}`,
            isUser: false
          }
          
          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    messages: [...chat.messages, errorMessage]
                  }
                : chat
            )
          )
        }
      }
    } finally {
      setChatState({ isGenerating: false, canEditLastMessage: false })
      generationController.current = null
    }
  }

  const stopGeneration = () => {
    if (generationController.current) {
      generationController.current.abort()
    }

    const currentChat = chats.find(chat => chat.id === currentChatId)
    const lastMessage = currentChat?.messages[currentChat.messages.length - 1]
    const userInput = lastMessage?.content

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.slice(0, -1)
            }
          : chat
      )
    )

    setChatState({ 
      isGenerating: false, 
      canEditLastMessage: true,
      lastUserInput: userInput
    })
  }

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const handleProfileSave = (newProfile: UserProfile) => {
    setUserProfile(newProfile)
    localStorage.setItem('user_profile', JSON.stringify(newProfile))
  }

  useEffect(() => {
    const storedProfile = localStorage.getItem('user_profile')
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    }
  }, [])

  const handleServerChange = (newServer: string) => {
    setCurrentServer(newServer)
    const stage = newServer.includes('5000') ? 'Stage 1' : 
                 newServer.includes('6000') ? 'Stage 2' : 'Stage 3'
    setCurrentStage(stage)
    localStorage.setItem('selected_server', newServer)
    localStorage.setItem('current_stage', stage)
  }

  useEffect(() => {
    const savedServer = localStorage.getItem('selected_server')
    const savedStage = localStorage.getItem('current_stage')
    if (savedServer) {
      setCurrentServer(savedServer)
    }
    if (savedStage) {
      setCurrentStage(savedStage)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        chatHistory={chats}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        currentChatId={currentChatId}
        userProfile={userProfile}
        onProfileSave={handleProfileSave}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b dark:border-gray-800">
          <ChatHeader title="NavigatorAI" />
          <StageSelector 
            currentServer={currentServer}
            onServerChange={handleServerChange}
          />
        </div>
        <ChatMessages
          messages={currentChat?.messages || []}
          isGenerating={chatState.isGenerating}
          onStopGeneration={stopGeneration}
        />
        <ChatInput
          onSendMessage={(content) => addMessage(content, true)}
          disabled={chatState.isGenerating}
          canEdit={chatState.canEditLastMessage}
          initialMessage={chatState.canEditLastMessage ? chatState.lastUserInput || '' : ''}
        />
      </div>
      <FileSidebar />
    </div>
  )
}

