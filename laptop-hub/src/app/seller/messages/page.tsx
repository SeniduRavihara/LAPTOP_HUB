'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'


interface Conversation {
  id: string
  userName: string
  lastMessage: string
  timestamp: string
  unread: number
  avatar: string
}

interface Message {
  id: string
  sender: 'user' | 'seller'
  content: string
  timestamp: string
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    userName: 'John Doe',
    lastMessage: 'When will the laptop be available?',
    timestamp: '2 min ago',
    unread: 3,
    avatar: 'JD',
  },
  {
    id: '2',
    userName: 'Jane Smith',
    lastMessage: 'Thank you for the quick delivery!',
    timestamp: '1 hour ago',
    unread: 0,
    avatar: 'JS',
  },
  {
    id: '3',
    userName: 'Mike Johnson',
    lastMessage: 'Does it have a warranty?',
    timestamp: '3 hours ago',
    unread: 1,
    avatar: 'MJ',
  },
  {
    id: '4',
    userName: 'Sarah Williams',
    lastMessage: 'I would like to negotiate the price',
    timestamp: '5 hours ago',
    unread: 0,
    avatar: 'SW',
  },
]

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'user',
    content: 'Hi, when will the Dell XPS 13 be in stock?',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    sender: 'seller',
    content: 'Hello! We have stock available right now. Would you like to place an order?',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    sender: 'user',
    content: 'Great! What about the warranty?',
    timestamp: '10:35 AM',
  },
  {
    id: '4',
    sender: 'seller',
    content: "It comes with Dell's standard 1-year warranty. We also offer extended warranty options.",
    timestamp: '10:37 AM',
  },
  {
    id: '5',
    sender: 'user',
    content: 'When will the laptop be available?',
    timestamp: '10:40 AM',
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1')
  const [messageInput, setMessageInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = mockConversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('')
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <SellerSidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">Communicate with your customers</p>
        </div>

        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 border-b border-border text-left transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-primary/10'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary-foreground">{conversation.avatar}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{conversation.userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                    {conversation.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 bg-card rounded-lg border border-border shadow-sm flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <p className="text-lg font-semibold text-foreground">
                {mockConversations.find((c) => c.id === selectedConversation)?.userName}
              </p>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'seller'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'seller' ? 'opacity-80' : 'text-muted-foreground'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      
      </main>
      </div>
      <Footer />
    </>
  )
}
