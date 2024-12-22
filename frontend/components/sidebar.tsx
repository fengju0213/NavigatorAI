import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Moon, Settings, PlusCircle, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react'
import { useThemeToggle } from '@/hooks/use-theme'
import { SettingsModal } from "./settings-modal"
import { Chat } from "@/types"
import { ProfileModal } from "./profile-modal"

interface SidebarProps {
  chatHistory: Chat[]
  onNewChat: () => void
  onSelectChat: (id: string) => void
  currentChatId: string
  userProfile: UserProfile
  onProfileSave: (profile: UserProfile) => void
}

export function Sidebar({ chatHistory, onNewChat, onSelectChat, currentChatId, userProfile, onProfileSave }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { toggleTheme } = useThemeToggle()

  const sortedChatHistory = [...chatHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className={`relative flex flex-col h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[260px]'}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute -right-4 top-4 z-50 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 p-0"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="p-4">
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded"></div>
              <h1 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">NavigatorAI</h1>
            </div>
            <Button 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white" 
              size="sm" 
              onClick={onNewChat}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </>
        )}
      </div>
      
      {!isCollapsed && (
        <>
          <div className="px-2 py-2 flex-1">
            <h2 className="px-2 mb-2 text-sm text-gray-500 dark:text-gray-400">RECENT CHATS</h2>
            <ScrollArea className="h-[calc(100vh-280px)]">
              {sortedChatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className={`flex items-center gap-3 w-full p-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    chat.id === currentChatId ? 'bg-gray-200 dark:bg-gray-600' : ''
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-medium dark:text-gray-200 truncate w-full text-left">{chat.title}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{chat.timestamp}</span>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => setIsProfileOpen(true)}>
              <UserCircle className="mr-2 h-4 w-4" />
              个人资料
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm" onClick={toggleTheme}>
              <Moon className="mr-2 h-4 w-4" />
              Dark mode
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>

          <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
          <ProfileModal 
            open={isProfileOpen} 
            onOpenChange={setIsProfileOpen}
            initialProfile={userProfile}
            onSave={onProfileSave}
          />
        </>
      )}
    </div>
  )
}

