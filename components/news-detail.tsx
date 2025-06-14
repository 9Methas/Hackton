"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface NewsDetailProps {
  news: {
    title: string
    date: string
    content: string
    image: string
  }
  goBack: () => void
}

export function NewsDetail({ news, goBack }: NewsDetailProps) {
  // Function to convert markdown to HTML (simple version)
  const markdownToHtml = (markdown: string) => {
    const html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      // Tables (simple)
      .replace(/^\|(.*)\|$/gm, "<tr>$1</tr>")
      .replace(/<tr>(.*?)<\/tr>/g, (match) =>
        match
          .replace(/\|/g, "</td><td>")
          .replace("</td><td>", "<td>")
          .replace(/<\/td>$/, "</td></tr>"),
      )
      // Wrap tables
      .replace(/(<tr>.*?<\/tr>\s*){2,}/gs, '<table class="border-collapse w-full my-4">$&</table>')
      // Fix table headers
      .replace(
        /<table class="border-collapse w-full my-4">(<tr>.*?<\/tr>)/s,
        '<table class="border-collapse w-full my-4">$1'
          .replace(/<td>/g, '<th class="border border-gray-300 px-4 py-2 bg-gray-100">')
          .replace(/<\/td>/g, "</th>"),
      )
      // Add table cell styling
      .replace(/<td>/g, '<td class="border border-gray-300 px-4 py-2">')
      // Paragraphs
      .replace(/^(?!<h|<li|<ul|<p|<\/|<table|<tr|<td)(.*$)/gm, '<p class="mb-3">$1</p>')
      // Convert consecutive list items to lists
      .replace(/(<li.*?>.*?<\/li>)\s*(<li.*?>.*?<\/li>)/gs, '<ul class="list-disc mb-4 pl-5">$1$2</ul>')
      // Fix any remaining list items
      .replace(/(<li.*?>.*?<\/li>)/g, '<ul class="list-disc mb-4 pl-5">$1</ul>')
      // Remove empty paragraphs
      .replace(/<p>\s*<\/p>/g, "")

    return html
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h3 className="text-center font-bold">{news.title}</h3>
          <p className="text-center text-xs text-gray-500">{news.date}</p>
        </div>
      </div>

      <div className="mb-4 h-40 w-full overflow-hidden rounded-lg">
        <img src={news.image || "/placeholder.svg"} alt={news.title} className="h-full w-full object-cover" />
      </div>

      <div className="max-h-[300px] overflow-y-auto rounded-lg bg-gray-50 p-4">
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(news.content) }} />
      </div>
    </div>
  )
}
