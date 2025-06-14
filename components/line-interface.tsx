"use client"

import { useState } from "react"
import { WelcomeScreen } from "./welcome-screen"
import { MapViewEnhanced } from "./map-view-enhanced"
import { WaterTestingRequest } from "./water-testing-request"
import { KnowledgeBase } from "./knowledge-base"
import { ConsultVolunteer } from "./consult-volunteer"
import { ProjectNews } from "./project-news"
import { MyWellInfo } from "./my-well-info"
import { ArticleView } from "./article-view"
import { NewsDetail } from "./news-detail"

export type Screen =
  | "welcome"
  | "map"
  | "water-testing"
  | "knowledge"
  | "consult"
  | "news"
  | "my-well"
  | "article-view"
  | "news-detail"
  | "register-well"

export interface ChatMessage {
  type: "system" | "user"
  content: string
  timestamp: Date
}

export function LineInterface() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: "system",
      content:
        "สวัสดีครับ ลุงมี! ยินดีต้อนรับสู่ 'เครือข่ายน้ำดี สุรนารี' เครื่องมือที่จะช่วยให้ท่าน 'เช็กให้ชัวร์ก่อนเจาะ' และ 'มั่นใจก่อนดื่ม' แตะที่เมนูด้านล่างเพื่อเริ่มต้นใช้งานได้เลยครับ",
      timestamp: new Date(),
    },
  ])
  const [selectedArticle, setSelectedArticle] = useState<{ title: string; content: string } | null>(null)
  const [selectedNews, setSelectedNews] = useState<{
    title: string
    date: string
    content: string
    image: string
  } | null>(null)

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)

    // Add system message when navigating to main screens
    if (["map", "water-testing", "knowledge", "consult", "news", "my-well"].includes(screen)) {
      const messages: Record<string, string> = {
        map: "กำลังแสดงแผนที่น้ำบาดาลในพื้นที่ของท่าน...",
        "water-testing": "ท่านต้องการขอตรวจน้ำหรือแจ้งผลตรวจ?",
        knowledge: "ยินดีต้อนรับสู่คลังความรู้เกี่ยวกับน้ำบาดาล",
        consult: "ท่านต้องการปรึกษา อสม. เกี่ยวกับเรื่องใด?",
        news: "ข่าวสารและกิจกรรมล่าสุดจากโครงการ",
        "my-well": "ข้อมูลบ่อน้ำของท่าน",
      }

      setChatHistory((prev) => [
        ...prev,
        {
          type: "system",
          content: messages[screen],
          timestamp: new Date(),
        },
      ])
    }
  }

  const addMessage = (message: string, type: "system" | "user" = "system") => {
    setChatHistory((prev) => [
      ...prev,
      {
        type,
        content: message,
        timestamp: new Date(),
      },
    ])
  }

  const viewArticle = (article: { title: string; content: string }) => {
    setSelectedArticle(article)
    setCurrentScreen("article-view")
  }

  const viewNewsDetail = (news: { title: string; date: string; content: string; image: string }) => {
    setSelectedNews(news)
    setCurrentScreen("news-detail")
  }

  return (
    <div className="mx-auto flex h-[700px] w-full max-w-sm flex-col overflow-hidden rounded-[2.5rem] border-8 border-black bg-white shadow-2xl">
      {/* iPhone-style notch */}
      <div className="relative h-8 bg-black">
        <div className="absolute left-1/2 top-1 h-1 w-20 -translate-x-1/2 rounded-full bg-black"></div>
      </div>

      {/* LINE Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center">
          <button className="mr-3 text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center">
            <span className="mr-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">99+</span>
            <div className="flex items-center">
              <div className="mr-2 h-8 w-8 rounded-full bg-[#00B900] flex items-center justify-center">
                <span className="text-white text-sm font-bold">💧</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">เครือข่ายน้ำดี สุรนารี</div>
                <div className="text-xs text-gray-500">Automated response</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50 to-blue-100 p-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`mb-4 flex ${message.type === "system" ? "justify-start" : "justify-end"}`}>
            {message.type === "system" && (
              <div className="mr-3 h-10 w-10 flex-shrink-0 rounded-full bg-[#00B900] flex items-center justify-center">
                <span className="text-white text-sm">🤖</span>
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                message.type === "system"
                  ? "bg-white text-gray-800 rounded-tl-sm"
                  : "bg-[#00B900] text-white rounded-tr-sm"
              }`}
            >
              <div className="text-sm leading-relaxed">{message.content}</div>
              <div className="mt-1 text-right text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {/* Current Screen Content */}
        <div className="mt-4">
          {currentScreen === "welcome" && <WelcomeScreen />}
          {currentScreen === "map" && <MapViewEnhanced addMessage={addMessage} />}
          {currentScreen === "water-testing" && <WaterTestingRequest addMessage={addMessage} />}
          {currentScreen === "knowledge" && <KnowledgeBase viewArticle={viewArticle} />}
          {currentScreen === "consult" && <ConsultVolunteer addMessage={addMessage} />}
          {currentScreen === "news" && <ProjectNews viewNewsDetail={viewNewsDetail} />}
          {currentScreen === "my-well" && <MyWellInfo navigateTo={navigateTo} addMessage={addMessage} />}
          {currentScreen === "article-view" && selectedArticle && (
            <ArticleView article={selectedArticle} goBack={() => navigateTo("knowledge")} />
          )}
          {currentScreen === "news-detail" && selectedNews && (
            <NewsDetail news={selectedNews} goBack={() => navigateTo("news")} />
          )}
        </div>
      </div>

      {/* Rich Menu */}
      <div className="bg-gradient-to-r from-[#00B900] to-[#00A000] p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Row 1 */}
          <button
            onClick={() => navigateTo("map")}
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
          >
            <div className="mb-2 text-2xl">🗺️</div>
            <span className="text-xs font-medium text-white">แผนที่น้ำบาดาล</span>
          </button>
          <button
            onClick={() => navigateTo("water-testing")}
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
          >
            <div className="mb-2 text-2xl">💧</div>
            <span className="text-xs font-medium text-white">ของรวจ/แจ้งผลน้ำ</span>
          </button>
          <button
            onClick={() => navigateTo("my-well")}
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
          >
            <div className="mb-2 text-2xl">👤</div>
            <span className="text-xs font-medium text-white">ข้อมูลส่วนบุคคล</span>
          </button>

          {/* Row 2 */}
          <button
            onClick={() => navigateTo("knowledge")}
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
          >
            <div className="mb-2 text-2xl">💡</div>
            <span className="text-xs font-medium text-white">คลังความรู้</span>
          </button>
          <button
            onClick={() => navigateTo("news")}
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
          >
            <div className="mb-2 text-2xl">📢</div>
            <span className="text-xs font-medium text-white">ข่าวสารโครงการ</span>
          </button>
          <button
            onClick={() => navigateTo("consult")}
            className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
          >
            <div className="mb-2 text-2xl">📞</div>
            <span className="text-xs font-medium text-white">ปรึกษาออนไลน์</span>
          </button>
        </div>
      </div>
    </div>
  )
}
