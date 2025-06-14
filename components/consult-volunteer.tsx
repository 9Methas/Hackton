"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, ArrowLeft } from "lucide-react"

interface ConsultVolunteerProps {
  addMessage: (message: string, type?: "system" | "user") => void
}

interface ChatMessage {
  id: number
  sender: "user" | "volunteer"
  content: string
  timestamp: Date
}

export function ConsultVolunteer({ addMessage }: ConsultVolunteerProps) {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "volunteer",
      content: "สวัสดีค่ะ ดิฉันพี่สมใจ อสม. ประจำหมู่บ้าน มีอะไรให้ช่วยเหลือไหมคะ?",
      timestamp: new Date(),
    },
  ])
  const [isSending, setIsSending] = useState(false)
  const [showChat, setShowChat] = useState(true)

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to chat
    const userMessage = {
      id: chatHistory.length + 1,
      sender: "user" as const,
      content: message,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    addMessage(message, "user")
    setMessage("")
    setIsSending(true)

    // Simulate volunteer response
    setTimeout(() => {
      let response = ""

      if (message.toLowerCase().includes("ตรวจน้ำ") || message.toLowerCase().includes("ทดสอบ")) {
        response =
          "ท่านสามารถขอรับบริการตรวจน้ำได้โดยกดที่เมนู 'ขอตรวจ/แจ้งผลน้ำ' ค่ะ หรือถ้าต้องการให้ดิฉันไปตรวจให้ที่บ้าน สามารถนัดวันเวลาได้เลยค่ะ"
      } else if (message.toLowerCase().includes("คุณภาพน้ำ") || message.toLowerCase().includes("น้ำไม่ดี")) {
        response = "หากท่านสงสัยว่าน้ำมีคุณภาพไม่ดี ควรส่งตรวจก่อนนำมาบริโภคนะคะ สังเกตได้จากสี กลิ่น และรสชาติที่ผิดปกติ หรือมีตะกอนในน้ำ"
      } else if (message.toLowerCase().includes("ราคา") || message.toLowerCase().includes("ค่าใช้จ่าย")) {
        response =
          "การตรวจน้ำเบื้องต้นไม่มีค่าใช้จ่ายค่ะ เป็นบริการจากโครงการเครือข่ายน้ำดี แต่หากต้องการตรวจละเอียดในห้องปฏิบัติการ จะมีค่าใช้จ่ายประมาณ 500-1,500 บาท ขึ้นอยู่กับพารามิเตอร์ที่ต้องการตรวจ"
      } else {
        response =
          "ขอบคุณสำหรับข้อความค่ะ ดิฉันจะติดต่อกลับไปเพื่อให้ข้อมูลเพิ่มเติมโดยเร็วที่สุด หรือท่านสามารถโทรหาดิฉันได้โดยตรงที่เบอร์ 08x-xxx-xxxx ค่ะ"
      }

      const volunteerMessage = {
        id: chatHistory.length + 2,
        sender: "volunteer",
        content: response,
        timestamp: new Date(),
      }

      setChatHistory((prev) => [...prev, volunteerMessage])
      addMessage(response)
      setIsSending(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleViewHistory = () => {
    setShowChat(false)
  }

  const handleBackToChat = () => {
    setShowChat(true)
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-3 text-center font-bold">ปรึกษา อสม.</h3>

      {showChat ? (
        <>
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center">
              <div className="mr-2 h-8 w-8 rounded-full bg-gray-300">
                <div className="flex h-full items-center justify-center">
                  <span className="text-sm">👩‍⚕️</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">พี่สมใจ ใจดี</div>
                <div className="text-xs text-gray-500">อสม. ประจำหมู่บ้าน</div>
              </div>
              <button onClick={handleViewHistory} className="ml-auto text-xs text-blue-600">
                ประวัติการสนทนา
              </button>
            </div>
          </div>

          <div className="mb-3 h-[200px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
            {chatHistory.map((chat) => (
              <div key={chat.id} className={`mb-2 flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                {chat.sender === "volunteer" && (
                  <div className="mr-2 h-6 w-6 flex-shrink-0 rounded-full bg-gray-300">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs">👩‍⚕️</span>
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-2 ${
                    chat.sender === "user" ? "bg-[#00B900] text-white" : "bg-white text-black shadow"
                  }`}
                >
                  <p className="text-sm">{chat.content}</p>
                  <div className="mt-1 text-right text-xs opacity-70">
                    {chat.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="mr-2 h-6 w-6 flex-shrink-0 rounded-full bg-gray-300">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs">👩‍⚕️</span>
                  </div>
                </div>
                <div className="flex space-x-1 rounded-lg bg-white p-3 shadow">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex">
            <Textarea
              placeholder="พิมพ์ข้อความที่ต้องการปรึกษา..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[80px] resize-none"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              className="ml-2 bg-[#00B900] hover:bg-[#009900]"
              disabled={!message.trim() || isSending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBackToChat} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h4 className="font-medium">ประวัติการสนทนา</h4>
          </div>

          <div className="space-y-2">
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="flex justify-between">
                <span className="font-medium">สนทนากับ พี่สมใจ</span>
                <span className="text-sm text-gray-500">วันนี้</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-1">{chatHistory[chatHistory.length - 1].content}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="flex justify-between">
                <span className="font-medium">สนทนากับ พี่สมใจ</span>
                <span className="text-sm text-gray-500">10 มิ.ย. 2568</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                ขอบคุณสำหรับข้อมูลค่ะ ดิฉันจะมาตรวจน้ำให้ในวันพรุ่งนี้ตามนัดนะคะ
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="flex justify-between">
                <span className="font-medium">สนทนากับ พี่สมใจ</span>
                <span className="text-sm text-gray-500">5 มิ.ย. 2568</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                สวัสดีค่ะ ผลการตรวจน้ำของท่านออกมาแล้ว น้ำมีคุณภาพอยู่ในเกณฑ์ดี สามารถใช้อุปโภคบริโภคได้ค่ะ
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
