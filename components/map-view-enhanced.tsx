"use client"

import { useState } from "react"
import { MapView } from "./map-view"
import { SoilProfileView } from "./soil-profile-view"

interface MapViewEnhancedProps {
  addMessage: (message: string, type?: "system" | "user") => void
}

export function MapViewEnhanced({ addMessage }: MapViewEnhancedProps) {
  const [view, setView] = useState<"map" | "soil-profile">("map")
  const [selectedWellId, setSelectedWellId] = useState<string>("")

  const handleViewSoilProfile = (wellId: string) => {
    setSelectedWellId(wellId)
    setView("soil-profile")
    addMessage(`ท่านได้เลือกดูข้อมูลชั้นดินของบ่อ #${wellId}`, "user")
  }

  const handleBackToMap = () => {
    setView("map")
  }

  if (view === "soil-profile") {
    return <SoilProfileView wellId={selectedWellId} goBack={handleBackToMap} />
  }

  return (
    <div className="space-y-2">
      <MapView addMessage={addMessage} />
      <div className="rounded-lg bg-white p-3 shadow-md">
        <h4 className="mb-2 font-medium">ข้อมูลเพิ่มเติม</h4>
        <div className="space-y-2">
          <button
            onClick={() => handleViewSoilProfile("SRN-1025")}
            className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-left text-sm hover:bg-gray-100"
          >
            <span className="font-medium">ดูข้อมูลชั้นดินบ่อ #SRN-1025</span>
            <p className="text-xs text-gray-500">แสดงข้อมูลชั้นดินและระดับน้ำบาดาล</p>
          </button>
          <button
            onClick={() => handleViewSoilProfile("SRN-1026")}
            className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-left text-sm hover:bg-gray-100"
          >
            <span className="font-medium">ดูข้อมูลชั้นดินบ่อ #SRN-1026</span>
            <p className="text-xs text-gray-500">แสดงข้อมูลชั้นดินและระดับน้ำบาดาล</p>
          </button>
          <button
            onClick={() => handleViewSoilProfile("SRN-1027")}
            className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-left text-sm hover:bg-gray-100"
          >
            <span className="font-medium">ดูข้อมูลชั้นดินบ่อ #SRN-1027</span>
            <p className="text-xs text-gray-500">แสดงข้อมูลชั้นดินและระดับน้ำบาดาล</p>
          </button>
        </div>
      </div>
    </div>
  )
}
