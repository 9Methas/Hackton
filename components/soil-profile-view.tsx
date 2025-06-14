"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft } from "lucide-react"

interface SoilProfileViewProps {
  wellId: string
  goBack: () => void
}

interface SoilLayer {
  depth: [number, number]
  type: string
  color: string
  description: string
  waterContent: number // 0-100%
}

export function SoilProfileView({ wellId, goBack }: SoilProfileViewProps) {
  const [depthView, setDepthView] = useState<number>(100) // View percentage (0-100%)

  // Sample soil profile data for the well
  const soilProfile: Record<string, SoilLayer[]> = {
    "SRN-1025": [
      {
        depth: [0, 5],
        type: "ดินร่วน",
        color: "#8B4513",
        description: "ดินร่วนผสมอินทรียวัตถุ",
        waterContent: 20,
      },
      {
        depth: [5, 15],
        type: "ดินเหนียว",
        color: "#A0522D",
        description: "ดินเหนียวสีน้ำตาลแดง",
        waterContent: 30,
      },
      {
        depth: [15, 30],
        type: "ดินทราย",
        color: "#DAA520",
        description: "ดินทรายละเอียด",
        waterContent: 40,
      },
      {
        depth: [30, 45],
        type: "กรวดทราย",
        color: "#CD853F",
        description: "กรวดทรายปนดินเหนียว (ชั้นให้น้ำ)",
        waterContent: 80,
      },
    ],
    "SRN-1026": [
      {
        depth: [0, 3],
        type: "ดินร่วน",
        color: "#8B4513",
        description: "ดินร่วนผสมอินทรียวัตถุ",
        waterContent: 15,
      },
      {
        depth: [3, 10],
        type: "ดินทราย",
        color: "#DAA520",
        description: "ดินทรายละเอียด",
        waterContent: 25,
      },
      {
        depth: [10, 25],
        type: "ทรายหยาบ",
        color: "#F4A460",
        description: "ทรายหยาบปนกรวดเล็ก (ชั้นให้น้ำ)",
        waterContent: 70,
      },
      {
        depth: [25, 38],
        type: "หินทราย",
        color: "#D2B48C",
        description: "หินทรายผุ",
        waterContent: 50,
      },
    ],
    "SRN-1027": [
      {
        depth: [0, 8],
        type: "ดินเหนียว",
        color: "#A0522D",
        description: "ดินเหนียวสีน้ำตาลแดง",
        waterContent: 35,
      },
      {
        depth: [8, 20],
        type: "ดินเหนียวปนทราย",
        color: "#B8860B",
        description: "ดินเหนียวปนทราย",
        waterContent: 40,
      },
      {
        depth: [20, 40],
        type: "หินดินดาน",
        color: "#696969",
        description: "หินดินดานสีเทา",
        waterContent: 20,
      },
      {
        depth: [40, 52],
        type: "หินปูน",
        color: "#A9A9A9",
        description: "หินปูนแตกหัก (ชั้นให้น้ำ)",
        waterContent: 60,
      },
    ],
  }

  // Get soil profile for the selected well or use default
  const wellProfile = soilProfile[wellId] || soilProfile["SRN-1025"]

  // Calculate total depth
  const totalDepth = wellProfile[wellProfile.length - 1].depth[1]

  // Function to get water level indicator position
  const getWaterLevelPosition = () => {
    // Find the first layer with significant water content
    const waterLayer = wellProfile.find((layer) => layer.waterContent >= 60)
    if (waterLayer) {
      return (waterLayer.depth[0] / totalDepth) * 100
    }
    return 70 // Default position if no significant water layer found
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="flex-1 text-center font-bold">ชั้นดินของบ่อ #{wellId}</h3>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">
          ความลึกที่แสดง: {Math.round((depthView / 100) * totalDepth)} เมตร
        </label>
        <Slider
          value={[depthView]}
          min={10}
          max={100}
          step={5}
          onValueChange={(value) => setDepthView(value[0])}
          className="py-4"
        />
      </div>

      <div className="relative mb-4 h-[300px] w-full rounded-lg border border-gray-200">
        {/* Soil layers */}
        <div className="absolute inset-0 overflow-hidden">
          {wellProfile.map((layer, index) => {
            const startPercent = (layer.depth[0] / totalDepth) * 100
            const endPercent = (layer.depth[1] / totalDepth) * 100
            const heightPercent = endPercent - startPercent
            const visibleHeight = Math.min(heightPercent, depthView - startPercent)

            // Only render if the layer is within the current view depth
            if (startPercent < depthView && visibleHeight > 0) {
              return (
                <div
                  key={index}
                  className="absolute w-full"
                  style={{
                    top: `${startPercent}%`,
                    height: `${visibleHeight}%`,
                    backgroundColor: layer.color,
                  }}
                >
                  <div className="p-1 text-xs text-white">
                    <span className="font-bold">{layer.type}</span>
                    <span className="ml-2">
                      ({layer.depth[0]}-{layer.depth[1]} ม.)
                    </span>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>

        {/* Water level indicator */}
        <div
          className="absolute left-0 w-full border-b-2 border-dashed border-blue-500"
          style={{ top: `${getWaterLevelPosition()}%` }}
        >
          <div className="absolute -top-5 right-0 rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-800">
            ระดับน้ำบาดาล
          </div>
        </div>

        {/* Depth markers */}
        <div className="absolute right-0 top-0 h-full w-8 border-l border-gray-300">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="absolute flex w-full items-center" style={{ top: `${percent}%` }}>
              <div className="absolute -left-2 h-0.5 w-2 bg-gray-300"></div>
              <span className="pl-1 text-xs">{Math.round((percent / 100) * totalDepth)}m</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <h4 className="font-medium">รายละเอียดชั้นดิน</h4>
        {wellProfile.map((layer, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className="mr-2 h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: layer.color }}></div>
            <div>
              <span className="font-medium">{layer.type}</span>
              <span className="mx-1 text-gray-500">
                ({layer.depth[0]}-{layer.depth[1]} ม.)
              </span>
              <span className="text-xs text-gray-600">- {layer.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
