"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, ArrowLeft, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface WaterTestingRequestProps {
  addMessage: (message: string, type?: "system" | "user") => void
}

type RequestStep = "options" | "volunteer-info" | "self-report" | "confirmation"

export function WaterTestingRequest({ addMessage }: WaterTestingRequestProps) {
  const [step, setStep] = useState<RequestStep>("options")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    wellId: "",
    testType: "basic",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleRequestTesting = () => {
    addMessage("ขอรับบริการตรวจน้ำ", "user")
    setStep("volunteer-info")
  }

  const handleReportResults = () => {
    addMessage("แจ้งผลตรวจด้วยตนเอง", "user")
    setStep("self-report")
  }

  const handleCallNow = () => {
    addMessage("โทรเลย", "user")
    addMessage("กำลังโทรหา อสม. สมใจ ใจดี...")
    setTimeout(() => {
      addMessage("การโทรเสร็จสิ้น อสม. จะมาตรวจน้ำให้ท่านในวันพรุ่งนี้เวลา 10:00 น.")
    }, 1500)
  }

  const handleRequestCallback = () => {
    addMessage("ให้ติดต่อกลับ", "user")
    addMessage("ขอบคุณครับ เราได้ส่งคำขอของท่านไปยัง อสม. แล้ว ท่านจะได้รับการติดต่อกลับภายใน 24 ชั่วโมง")
    setStep("confirmation")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, testType: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.wellId) {
      newErrors.wellId = "กรุณาระบุรหัสบ่อ"
    }

    if (!formData.name) {
      newErrors.name = "กรุณาระบุชื่อ"
    }

    if (!formData.phone) {
      newErrors.phone = "กรุณาระบุเบอร์โทรศัพท์"
    } else if (!/^\d{9,10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitReport = () => {
    if (validateForm()) {
      addMessage(`ส่งผลการตรวจน้ำบ่อ #${formData.wellId} เรียบร้อยแล้ว`, "user")
      addMessage("ขอบคุณสำหรับข้อมูล! เราได้รับรายงานผลการตรวจน้ำของท่านแล้ว ข้อมูลจะถูกนำไปปรับปรุงฐานข้อมูลของเราต่อไป")
      setStep("confirmation")
    }
  }

  const handleBackToOptions = () => {
    setStep("options")
    setFormData({
      name: "",
      phone: "",
      address: "",
      wellId: "",
      testType: "basic",
      notes: "",
    })
    setErrors({})
  }

  if (step === "options") {
    return (
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-800">บริการตรวจน้ำ</h3>
          <p className="text-sm text-gray-600">เลือกบริการที่ท่านต้องการ</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRequestTesting}
            className="w-full rounded-xl bg-gradient-to-r from-[#00B900] to-[#00A000] p-4 text-white transition-all hover:shadow-lg active:scale-95"
          >
            <div className="flex items-center justify-center">
              <span className="mr-2 text-xl">🙋‍♂️</span>
              <span className="font-medium">ขอรับบริการตรวจน้ำ</span>
            </div>
          </button>

          <button
            onClick={handleReportResults}
            className="w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
          >
            <div className="flex items-center justify-center">
              <span className="mr-2 text-xl">📝</span>
              <span className="font-medium">แจ้งผลตรวจด้วยตนเอง</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  if (step === "volunteer-info") {
    return (
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBackToOptions} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="flex-1 text-center font-bold text-gray-800">ติดต่อ อสม.</h3>
        </div>

        <div className="text-center">
          <div className="mb-4 inline-flex rounded-full bg-green-100 p-4">
            <span className="text-3xl">👩‍⚕️</span>
          </div>
          <h4 className="mb-1 text-lg font-semibold text-gray-800">พี่สมใจ ใจดี</h4>
          <p className="mb-2 text-sm text-gray-600">อาสาสมัครสาธารณสุขประจำหมู่บ้าน</p>
          <div className="mb-4 flex items-center justify-center rounded-lg bg-blue-50 p-2">
            <Phone className="mr-2 h-4 w-4 text-blue-600" />
            <span className="font-mono text-blue-600">08x-xxx-xxxx</span>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-center text-sm text-gray-600">
            ท่านสามารถโทรหาพี่สมใจได้โดยตรง หรือกดปุ่ม 'ให้ติดต่อกลับ' เพื่อให้เราส่งเรื่องให้พี่สมใจติดต่อท่านกลับไป
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCallNow}
            className="rounded-xl bg-gradient-to-r from-[#00B900] to-[#00A000] p-3 text-white transition-all hover:shadow-lg active:scale-95"
          >
            <div className="flex items-center justify-center">
              <span className="mr-1 text-lg">📞</span>
              <span className="text-sm font-medium">โทรเลย</span>
            </div>
          </button>
          <button
            onClick={handleRequestCallback}
            className="rounded-xl border-2 border-gray-200 bg-white p-3 text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
          >
            <div className="flex items-center justify-center">
              <span className="mr-1 text-lg">💬</span>
              <span className="text-sm font-medium">ให้ติดต่อกลับ</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  if (step === "self-report") {
    return (
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBackToOptions} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="flex-1 text-center font-bold text-gray-800">แจ้งผลตรวจน้ำ</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wellId" className="text-sm font-medium text-gray-700">
              รหัสบ่อ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="wellId"
              name="wellId"
              placeholder="เช่น SRN-1025"
              value={formData.wellId}
              onChange={handleInputChange}
              className={`rounded-lg ${errors.wellId ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.wellId && <p className="text-xs text-red-500">{errors.wellId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              ชื่อผู้แจ้ง <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="ชื่อ-นามสกุล"
              value={formData.name}
              onChange={handleInputChange}
              className={`rounded-lg ${errors.name ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="0xxxxxxxxx"
              value={formData.phone}
              onChange={handleInputChange}
              className={`rounded-lg ${errors.phone ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">ประเภทการตรวจ</Label>
            <RadioGroup value={formData.testType} onValueChange={handleRadioChange} className="space-y-2">
              <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic" className="text-sm">
                  ตรวจพื้นฐาน (pH, ความกระด้าง, เหล็ก)
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="text-sm">
                  ตรวจละเอียด (รวมโลหะหนัก แบคทีเรีย)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              หมายเหตุ (ถ้ามี)
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="รายละเอียดเพิ่มเติม..."
              value={formData.notes}
              onChange={handleInputChange}
              className="min-h-[80px] rounded-lg border-gray-200"
            />
          </div>

          <button
            onClick={handleSubmitReport}
            className="w-full rounded-xl bg-gradient-to-r from-[#00B900] to-[#00A000] p-4 text-white transition-all hover:shadow-lg active:scale-95"
          >
            <span className="font-medium">ส่งข้อมูล</span>
          </button>
        </div>
      </div>
    )
  }

  if (step === "confirmation") {
    return (
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mb-4 inline-flex rounded-full bg-green-100 p-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-800">ดำเนินการเรียบร้อย</h3>
          <p className="mb-6 text-sm text-gray-600">ขอบคุณสำหรับข้อมูล เราได้รับคำขอของท่านแล้ว</p>
          <button
            onClick={handleBackToOptions}
            className="rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
          >
            <span className="font-medium">กลับสู่หน้าหลัก</span>
          </button>
        </div>
      </div>
    )
  }

  return null
}
