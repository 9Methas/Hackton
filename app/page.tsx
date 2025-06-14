import { LineInterface } from "@/components/line-interface"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-4 text-center text-xl font-bold text-gray-700">เครือข่ายน้ำดี สุรนารี (LINE Prototype)</h1>
        <LineInterface />
      </div>
    </main>
  )
}
