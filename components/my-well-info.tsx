"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, MapPin, AlertTriangle, CheckCircle } from "lucide-react"
import type { Screen } from "./line-interface"

interface MyWellInfoProps {
  navigateTo: (screen: Screen) => void
  addMessage: (message: string, type?: "system" | "user") => void
}

interface Well {
  id: string
  name: string
  depth: number
  location: string
  status: "good" | "moderate" | "bad" | "unknown"
  lastChecked: string
  warning?: string
}

export function MyWellInfo({ navigateTo, addMessage }: MyWellInfoProps) {
  const [hasWells, setHasWells] = useState(false)
  const [wells, setWells] = useState<Well[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [selectedWell, setSelectedWell] = useState<Well | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    depth: "",
    location: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleRegisterWell = () => {
    setIsRegistering(true)
  }

  const handleBackToList = () => {
    setIsRegistering(false)
    setSelectedWell(null)
    setFormData({
      name: "",
      depth: "",
      location: "",
      notes: "",
    })
    setErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = "กรุณาระบุชื่อบ่อน้ำ"
    }

    if (!formData.depth) {
      newErrors.depth = "กรุณาระบุความลึก"
    } else if (isNaN(Number(formData.depth)) || Number(formData.depth) <= 0) {
      newErrors.depth = "ความลึกต้องเป็นตัวเลขมากกว่า 0"
    }

    if (!formData.location) {
      newErrors.location = "กรุณาระบุตำแหน่งที่ตั้ง"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitRegistration = () => {
    if (validateForm()) {
      // Generate a random ID
      const wellId = `SRN-${1000 + Math.floor(Math.random() * 9000)}`

      // Create new well
      const newWell: Well = {
        id: wellId,
        name: formData.name,
        depth: Number(formData.depth),
        location: formData.location,
        status: "unknown",
        lastChecked: "-",
      }

      // Add to wells list
      setWells((prev) => [...prev, newWell])
      setHasWells(true)
      setIsRegistering(false)

      // Add message
      addMessage(`ลงทะเบียนบ่อน้ำ "${formData.name}" เรียบร้อยแล้ว รหัสบ่อของท่านคือ ${wellId}`, "system")

      // Reset form
      setFormData({
        name: "",
        depth: "",
        location: "",
        notes: "",
      })
    }
  }

  const handleViewWellDetail = (well: Well) => {
    setSelectedWell(well)
    addMessage(`ท่านได้เลือกดูข้อมูลบ่อ "${well.name}" (${well.id})`, "user")
  }

  const getStatusColor = (status: Well["status"]) => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "moderate":
        return "text-yellow-500"
      case "bad":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusText = (status: Well["status"]) => {
    switch (status) {
      case "good":
        return "🟢 คุณภาพดี ผ่านเกณฑ์"
      case "moderate":
        return "🟡 พอใช้"
      case "bad":
        return "🔴 ไม่ผ่านเกณฑ์"
      default:
        return "⚫️ ยังไม่มีข้อมูล"
    }
  }

  const getStatusIcon = (status: Well["status"]) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "moderate":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "bad":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />
    }
  }

  // If user is viewing a specific well
  if (selectedWell) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="mb-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="flex-1 text-center font-bold">รายละเอียดบ่อน้ำ</h3>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {getStatusIcon(selectedWell.status)}
            </div>
            <div>
              <h4 className="font-medium">{selectedWell.name}</h4>
              <p className="text-xs text-gray-500">รหัส: {selectedWell.id}</p>
            </div>
          </div>
          <div
            className={`rounded-full px-2 py-0.5 text-xs ${
              selectedWell.status === "good"
                ? "bg-green-100 text-green-800"
                : selectedWell.status === "moderate"
                  ? "bg-yellow-100 text-yellow-800"
                  : selectedWell.status === "bad"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {getStatusText(selectedWell.status)}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">ความลึก</p>
              <p className="font-medium">{selectedWell.depth} เมตร</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ตรวจล่าสุด</p>
              <p className="font-medium">{selectedWell.lastChecked}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">ตำแหน่งที่ตั้ง</p>
            <p className="font-medium">{selectedWell.location}</p>
          </div>

          {selectedWell.warning && (
            <div className="rounded-md bg-yellow-50 p-2 text-yellow-800">
              <p className="text-xs font-medium">ข้อควรระวัง:</p>
              <p className="text-sm">{selectedWell.warning}</p>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <Button onClick={() => navigateTo("water-testing")} className="w-full bg-[#00B900] hover:bg-[#009900]">
            ขอตรวจคุณภาพน้ำ
          </Button>
          <Button onClick={() => navigateTo("map")} variant="outline" className="w-full">
            ดูบ่อน้ำบนแผนที่
          </Button>
        </div>
      </div>
    )
  }

  // If user is registering a new well
  if (isRegistering) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="mb-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="flex-1 text-center font-bold">ลงทะเบียนบ่อน้ำใหม่</h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">
              ชื่อบ่อน้ำ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="เช่น บ่อน้ำบ้านหลังใหญ่"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="depth">
              ความลึก (เมตร) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="depth"
              name="depth"
              type="number"
              placeholder="เช่น 45"
              value={formData.depth}
              onChange={handleInputChange}
              className={errors.depth ? "border-red-500" : ""}
            />
            {errors.depth && <p className="text-xs text-red-500">{errors.depth}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="location">
              ตำแหน่งที่ตั้ง <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="เช่น บ้านเลขที่ 123 หมู่ 4"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">หมายเหตุ (ถ้ามี)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับบ่อน้ำ..."
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          <Button onClick={handleSubmitRegistration} className="w-full bg-[#00B900] hover:bg-[#009900]">
            ลงทะเบียนบ่อน้ำ
          </Button>
        </div>
      </div>
    )
  }

  // Default view - list of wells or empty state
  if (!hasWells) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-3 text-center font-bold">ข้อมูลบ่อของฉัน</h3>

        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-center">
          <div className="mb-2 text-4xl">🚫</div>
          <p className="mb-2 text-gray-600">ท่านยังไม่มีข้อมูลบ่อน้ำในระบบ</p>
          <p className="text-sm text-gray-500">ลงทะเบียนบ่อน้ำของท่านเพื่อติดตามคุณภาพน้ำและรับการแจ้งเตือน</p>
        </div>

        <Button onClick={handleRegisterWell} className="w-full bg-[#00B900] hover:bg-[#009900]">
          ลงทะเบียนบ่อน้ำใหม่
        </Button>
      </div>
    )
  }

  // Show list of wells
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">ข้อมูลบ่อของฉัน</h3>
        <Button onClick={handleRegisterWell} size="sm" className="bg-[#00B900] hover:bg-[#009900]">
          <Plus className="mr-1 h-4 w-4" /> เพิ่มบ่อใหม่
        </Button>
      </div>

      <div className="space-y-3">
        {wells.map((well) => (
          <div
            key={well.id}
            className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
            onClick={() => handleViewWellDetail(well)}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{well.name}</h4>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  well.status === "good"
                    ? "bg-green-100 text-green-800"
                    : well.status === "moderate"
                      ? "bg-yellow-100 text-yellow-800"
                      : well.status === "bad"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {getStatusText(well.status)}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              ความลึก: {well.depth} เมตร | รหัส: {well.id}
            </div>
            <div className="mt-1 text-sm text-gray-600">ตรวจล่าสุด: {well.lastChecked}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
