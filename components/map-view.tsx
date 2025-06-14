"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })
const useMap = dynamic(() => import("react-leaflet").then((mod) => mod.useMap), { ssr: false })

interface MapViewProps {
  addMessage: (message: string, type?: "system" | "user") => void
}

interface WellInfo {
  id: string
  depth: number
  status: "good" | "moderate" | "bad" | "unknown"
  lastChecked: string
  warning?: string
  location: [number, number] // [latitude, longitude]
  soilType?: string
  waterDepth?: number
}

interface SoilLayer {
  id: string
  name: string
  color: string
  description: string
  visible: boolean
  data: any // GeoJSON data
}

// Component to handle map interactions
const MapControls = ({ wells, onSelectWell }: { wells: WellInfo[]; onSelectWell: (well: WellInfo) => void }) => {
  const map = useMap()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Function to locate user
  const handleLocateUser = () => {
    map.locate({ setView: true, maxZoom: 16 })
    map.on("locationfound", (e: any) => {
      setUserLocation([e.latlng.lat, e.latlng.lng])
    })
  }

  // Function to reset view
  const handleResetView = () => {
    // Center on Thailand
    map.setView([15.87, 100.9925], 6)
  }

  useEffect(() => {
    // Initial setup
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [map])

  return (
    <>
      {wells.map((well) => (
        <Marker
          key={well.id}
          position={well.location}
          eventHandlers={{
            click: () => {
              onSelectWell(well)
            },
          }}
          icon={
            new (window as any).L.Icon({
              iconUrl: `/marker-${well.status}.svg`,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })
          }
        >
          <Popup>
            <div className="p-1 text-sm">
              <div className="font-bold">บ่อ #{well.id}</div>
              <div>ความลึก: {well.depth} เมตร</div>
              <div>ตรวจล่าสุด: {well.lastChecked}</div>
              <button
                className="mt-1 text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  onSelectWell(well)
                }}
              >
                ดูรายละเอียด
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {userLocation && (
        <Marker
          position={userLocation}
          icon={
            new (window as any).L.Icon({
              iconUrl: "/user-location.png",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })
          }
        >
          <Popup>ตำแหน่งของคุณ</Popup>
        </Marker>
      )}
    </>
  )
}

export function MapView({ addMessage }: MapViewProps) {
  const [selectedWell, setSelectedWell] = useState<WellInfo | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [mapReady, setMapReady] = useState<boolean>(false)
  const [soilLayers, setSoilLayers] = useState<SoilLayer[]>([
    {
      id: "clay",
      name: "ชั้นดินเหนียว",
      color: "#a97c50",
      description: "ชั้นดินเหนียวที่มีการอุ้มน้ำสูง น้ำซึมผ่านได้ยาก",
      visible: true,
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "ชั้นดินเหนียว", depth: "0-10 เมตร" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [100.9825, 15.86],
                  [101.0025, 15.86],
                  [101.0025, 15.88],
                  [100.9825, 15.88],
                  [100.9825, 15.86],
                ],
              ],
            },
          },
        ],
      },
    },
    {
      id: "sand",
      name: "ชั้นดินทราย",
      color: "#e6c35c",
      description: "ชั้นดินทรายที่น้ำซึมผ่านได้ดี เหมาะแก่การกักเก็บน้ำบาดาล",
      visible: true,
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "ชั้นดินทราย", depth: "10-30 เมตร" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [100.9725, 15.85],
                  [101.0125, 15.85],
                  [101.0125, 15.89],
                  [100.9725, 15.89],
                  [100.9725, 15.85],
                ],
              ],
            },
          },
        ],
      },
    },
    {
      id: "rock",
      name: "ชั้นหินแข็ง",
      color: "#8c8c8c",
      description: "ชั้นหินแข็งที่น้ำซึมผ่านได้น้อย มักพบในพื้นที่ภูเขา",
      visible: true,
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "ชั้นหินแข็ง", depth: "30+ เมตร" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [100.9625, 15.84],
                  [101.0225, 15.84],
                  [101.0225, 15.9],
                  [100.9625, 15.9],
                  [100.9625, 15.84],
                ],
              ],
            },
          },
        ],
      },
    },
  ])

  const mapRef = useRef<any>(null)

  const wells: WellInfo[] = [
    {
      id: "SRN-1025",
      depth: 45,
      status: "moderate",
      lastChecked: "15 พ.ค. 2568",
      warning: "มีปริมาณหินปูนสูง อาจทำให้เกิดตะกรัน",
      location: [15.87, 100.9925],
      soilType: "ดินเหนียวปนทราย",
      waterDepth: 30,
    },
    {
      id: "SRN-1026",
      depth: 38,
      status: "good",
      lastChecked: "10 พ.ค. 2568",
      location: [15.875, 101.0],
      soilType: "ดินทราย",
      waterDepth: 25,
    },
    {
      id: "SRN-1027",
      depth: 52,
      status: "bad",
      lastChecked: "12 พ.ค. 2568",
      warning: "พบการปนเปื้อนสารหนู เกินค่ามาตรฐาน",
      location: [15.865, 100.985],
      soilType: "ดินเหนียว",
      waterDepth: 40,
    },
    {
      id: "SRN-1028",
      depth: 40,
      status: "unknown",
      lastChecked: "-",
      location: [15.88, 100.995],
      soilType: "ดินร่วน",
      waterDepth: 32,
    },
    {
      id: "SRN-1029",
      depth: 35,
      status: "good",
      lastChecked: "18 พ.ค. 2568",
      location: [15.873, 100.988],
      soilType: "ดินทราย",
      waterDepth: 20,
    },
    {
      id: "SRN-1030",
      depth: 48,
      status: "moderate",
      lastChecked: "5 พ.ค. 2568",
      warning: "พบปริมาณเหล็กสูง ควรติดตั้งเครื่องกรอง",
      location: [15.868, 100.997],
      soilType: "ดินเหนียวปนทราย",
      waterDepth: 35,
    },
  ]

  const handlePinClick = (well: WellInfo) => {
    setSelectedWell(well)
    addMessage(`ท่านได้เลือกดูข้อมูลบ่อ #${well.id}`, "user")
  }

  const handleSearch = () => {
    if (!searchQuery) return

    const foundWell = wells.find((well) => well.id.toLowerCase().includes(searchQuery.toLowerCase()))
    if (foundWell) {
      setSelectedWell(foundWell)
      addMessage(`ค้นพบบ่อ #${foundWell.id}`, "system")
      // Center map on the found well
      if (mapRef.current) {
        mapRef.current.setView(foundWell.location, 15)
      }
    } else {
      addMessage(`ไม่พบบ่อที่ตรงกับ "${searchQuery}"`, "system")
    }
  }

  const toggleLayerVisibility = (layerId: string) => {
    setSoilLayers((prevLayers) =>
      prevLayers.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)),
    )
  }

  const getStatusColor = (status: WellInfo["status"]) => {
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

  const getStatusText = (status: WellInfo["status"]) => {
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

  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    document.head.appendChild(link)

    // Add Leaflet JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    script.onload = () => setMapReady(true)
    document.head.appendChild(script)

    // Create marker icons
    if (typeof window !== "undefined") {
      // Create SVG markers for different well statuses
      const createMarkerSVG = (color: string) => {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
          <path fill="${color}" d="M12.5 0C5.596 0 0 5.596 0 12.5C0 19.404 12.5 41 12.5 41S25 19.404 25 12.5C25 5.596 19.404 0 12.5 0Z" />
          <circle cx="12.5" cy="12.5" r="5.5" fill="white" />
        </svg>`
      }

      // Create user location marker
      const userLocationSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="#4285F4" opacity="0.3" />
        <circle cx="10" cy="10" r="5" fill="#4285F4" />
        <circle cx="10" cy="10" r="3" fill="white" />
      </svg>`

      // Create Blob URLs for the SVGs
      const createBlobURL = (svg: string) => {
        const blob = new Blob([svg], { type: "image/svg+xml" })
        return URL.createObjectURL(blob)
      }

      // Create and save the marker files
      const markers = {
        good: createMarkerSVG("#4CAF50"), // Green
        moderate: createMarkerSVG("#FFC107"), // Yellow
        bad: createMarkerSVG("#F44336"), // Red
        unknown: createMarkerSVG("#9E9E9E"), // Gray
        user: userLocationSVG,
      }

      Object.entries(markers).forEach(([key, svg]) => {
        const url = createBlobURL(svg)
        const link = document.createElement("link")
        link.rel = "preload"
        link.href = url
        link.as = "image"
        document.head.appendChild(link)

        // Save URL to window for later use
        if (typeof window !== "undefined") {
          if (!window.markerUrls) {
            window.markerUrls = {}
          }
          window.markerUrls[key] = url
        }
      })
    }

    return () => {
      // Clean up
      if (typeof window !== "undefined" && window.markerUrls) {
        Object.values(window.markerUrls).forEach((url) => URL.revokeObjectURL(url as string))
      }
    }
  }, [])

  if (!mapReady) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-white p-4 shadow-md">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#00B900] mx-auto"></div>
          <p>กำลังโหลดแผนที่...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      {/* Map Controls */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-2">
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" title="ชั้นข้อมูล">
                <Layers className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <h4 className="font-medium">ชั้นข้อมูล</h4>
                {soilLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`layer-${layer.id}`}
                      checked={layer.visible}
                      onCheckedChange={() => toggleLayerVisibility(layer.id)}
                    />
                    <Label htmlFor={`layer-${layer.id}`} className="flex items-center">
                      <span
                        className="mr-2 inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      ></span>
                      {layer.name}
                    </Label>
                  </div>
                ))}
                <div className="mt-2 text-xs text-gray-500">
                  <p>ข้อมูลชั้นดินเป็นข้อมูลจำลองเพื่อการแสดงผลเท่านั้น</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center">
          {showSearch ? (
            <div className="flex">
              <Input
                type="text"
                placeholder="ค้นหารหัสบ่อ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-32 text-sm"
              />
              <Button variant="default" size="sm" onClick={handleSearch} className="ml-1 h-8 bg-[#00B900]">
                ค้นหา
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="icon" onClick={() => setShowSearch(true)} title="ค้นหา">
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[300px]">
        <MapContainer
          center={[15.87, 100.9925]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Soil Layers */}
          {soilLayers.map(
            (layer) =>
              layer.visible && (
                <GeoJSON
                  key={layer.id}
                  data={layer.data}
                  style={() => ({
                    fillColor: layer.color,
                    weight: 1,
                    opacity: 0.8,
                    color: "white",
                    fillOpacity: 0.35,
                  })}
                >
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-bold">{layer.name}</h4>
                      <p className="text-sm">{layer.description}</p>
                      <p className="text-xs text-gray-500">
                        {layer.data.features[0].properties.depth
                          ? `ความลึก: ${layer.data.features[0].properties.depth}`
                          : ""}
                      </p>
                    </div>
                  </Popup>
                </GeoJSON>
              ),
          )}

          {/* Wells and Controls */}
          <MapControls wells={wells} onSelectWell={handlePinClick} />
        </MapContainer>
      </div>

      {/* Selected Well Info */}
      {selectedWell && (
        <div className="p-4">
          <h3 className="mb-2 font-bold">ข้อมูลบ่อน้ำบาดาล</h3>
          <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">รหัสอ้างอิง:</span>
              <span>บ่อ #{selectedWell.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ความลึก:</span>
              <span>{selectedWell.depth} เมตร</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ความลึกของชั้นน้ำ:</span>
              <span>{selectedWell.waterDepth} เมตร</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ชนิดของดิน:</span>
              <span>{selectedWell.soilType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">สถานะ:</span>
              <span className={getStatusColor(selectedWell.status)}>{getStatusText(selectedWell.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ผลตรวจล่าสุด:</span>
              <span>{selectedWell.lastChecked}</span>
            </div>
            {selectedWell.warning && (
              <div className="mt-2 rounded-md bg-yellow-50 p-2 text-yellow-800">
                <span className="font-medium">ข้อควรระวัง:</span> {selectedWell.warning}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
