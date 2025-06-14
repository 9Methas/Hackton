"use client"

import { useState } from "react"
import { Search, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"

interface KnowledgeBaseProps {
  viewArticle: (article: { title: string; content: string }) => void
}

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  icon: string
}

export function KnowledgeBase({ viewArticle }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const articles: Article[] = [
    {
      id: "water-quality-check",
      title: "วิธีการตรวจสอบคุณภาพน้ำเบื้องต้น",
      excerpt: "เรียนรู้วิธีสังเกตคุณภาพน้ำด้วยตาเปล่าและการทดสอบอย่างง่าย",
      content: `# วิธีการตรวจสอบคุณภาพน้ำเบื้องต้น...`,
      category: "testing",
      icon: "🔬",
    },
    {
      id: "water-contaminants",
      title: "สารปนเปื้อนที่พบบ่อยในน้ำบาดาล",
      excerpt: "รู้จักสารปนเปื้อนที่พบบ่อยในน้ำบาดาลและผลกระทบต่อสุขภาพ",
      content: `# สารปนเปื้อนที่พบบ่อยในน้ำบาดาล...`,
      category: "contaminants",
      icon: "⚠️",
    },
    {
      id: "water-treatment",
      title: "วิธีการบำบัดน้ำบาดาลเพื่อการอุปโภคบริโภค",
      excerpt: "เทคนิคการกรองและบำบัดน้ำบาดาลให้ปลอดภัยสำหรับการใช้ในครัวเรือน",
      content: `# วิธีการบำบัดน้ำบาดาลเพื่อการอุปโภคบริโภค...`,
      category: "treatment",
      icon: "🔧",
    },
  ]

  const filteredArticles = articles.filter((article) => {
    if (activeCategory !== "all" && article.category !== activeCategory) {
      return false
    }

    if (
      searchQuery &&
      !article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const categories = [
    { id: "all", name: "ทั้งหมด", icon: "📚" },
    { id: "testing", name: "การตรวจสอบ", icon: "🔬" },
    { id: "contaminants", name: "สารปนเปื้อน", icon: "⚠️" },
    { id: "treatment", name: "การบำบัด", icon: "🔧" },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mb-4 inline-flex rounded-full bg-yellow-100 p-3">
            <BookOpen className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-800">คลังความรู้</h3>
          <p className="text-sm text-gray-600">ความรู้เกี่ยวกับน้ำบาดาลและการดูแลรักษา</p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="ค้นหาบทความ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border-gray-200 pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-lg p-3 text-center transition-all ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-[#00B900] to-[#00A000] text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="text-lg">{category.icon}</div>
              <div className="text-xs font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div key={article.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start">
                <div className="mr-3 rounded-lg bg-blue-100 p-2">
                  <span className="text-lg">{article.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-gray-800">{article.title}</h4>
                  <p className="mb-3 text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  <button
                    onClick={() => viewArticle({ title: article.title, content: article.content })}
                    className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    อ่านเพิ่มเติม →
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="mb-2 text-2xl">🔍</div>
            <p className="text-gray-500">ไม่พบบทความที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  )
}
