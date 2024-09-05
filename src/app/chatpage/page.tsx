"use client"
import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Send, Upload, ChevronLeft, ChevronRight, User, Bell, Settings, File } from "lucide-react"
import { Resizable } from 're-resizable'

export default function DocumentViewer() {
  const [files, setFiles] = useState<string[]>(["example_document.pdf"])
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm your AI assistant. How can I help you with your document today?", isUser: false },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLeftColumnVisible, setIsLeftColumnVisible] = useState(true)
  const [pdfViewerWidth, setPdfViewerWidth] = useState(600)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files).map(file => file.name) : []
    setFiles([...files, ...newFiles])
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }])
      setInputMessage('')
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Great! I'd be happy to help you with that. Could you please provide more details about the specific part of the document you'd like assistance with?", 
          isUser: false 
        }])
      }, 1000)
    }
  }

  const handleResize = useCallback((e: MouseEvent | TouchEvent, direction: string, ref: HTMLElement, d: { width: number; height: number }) => {
    setPdfViewerWidth(pdfViewerWidth + d.width)
  }, [pdfViewerWidth])

  const toggleLeftColumn = () => {
    setIsLeftColumnVisible(prev => !prev)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <div className="text-xl font-bold">AI ChatPDF</div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - File List */}
        <div className={`${isLeftColumnVisible ? 'w-64' : 'w-0'} border-r transition-all duration-300 ease-in-out overflow-hidden`}>
          <div className="p-4">
            <Button className="mb-4 w-full" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              multiple
            />
            <ScrollArea className="h-[calc(100vh-220px)]">
              {files.map((file, index) => (
                <div key={index} className="flex items-center py-2 px-2 hover:bg-accent rounded-md cursor-pointer">
                  <File className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate">{file}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        {/* Middle Column - PDF Viewer */}
        <Resizable
          size={{ width: pdfViewerWidth, height: '100%' }}
          onResizeStop={handleResize}
          enable={{ right: true }}
          minWidth={300}
          maxWidth={1200}
        >
          <div className="h-full overflow-auto relative">
            <Button 
              className="absolute top-4 left-4 z-10"
              variant="outline"
              size="icon"
              onClick={toggleLeftColumn}
            >
              {isLeftColumnVisible ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div className="p-4 pt-16">
              <h2 className="mb-4 text-lg font-semibold">PDF Viewer</h2>
              <div className="h-[calc(100vh-200px)] bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">PDF Viewer Placeholder</span>
              </div>
            </div>
          </div>
        </Resizable>

        {/* Right Column - Chat with AI Bot */}
        <div className="flex-1 p-4 flex flex-col min-w-[300px]">
          <h2 className="mb-4 text-lg font-semibold">Chat with AI Assistant</h2>
          <ScrollArea className="flex-1 mb-4 border rounded-lg p-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                {!message.isUser && (
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src="/ai-avatar.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 mr-2"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}