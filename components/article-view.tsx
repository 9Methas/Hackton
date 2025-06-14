"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ArticleViewProps {
  article: {
    title: string
    content: string
  }
  goBack: () => void
}

export function ArticleView({ article, goBack }: ArticleViewProps) {
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
      // Paragraphs
      .replace(/^(?!<h|<li|<ul|<p|<\/)(.*$)/gm, '<p class="mb-3">$1</p>')
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
        <h3 className="flex-1 text-center font-bold">{article.title}</h3>
      </div>

      <div className="max-h-[400px] overflow-y-auto rounded-lg bg-gray-50 p-4">
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }} />
      </div>
    </div>
  )
}
