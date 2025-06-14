export function WelcomeScreen() {
  return (
    <div className="space-y-4">
      {/* Water Filter Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="rounded-lg bg-blue-50 p-4">
            <svg className="h-16 w-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
        <h2 className="mb-2 text-center text-lg font-bold text-gray-800">เครือข่ายน้ำดี สุรนารี</h2>
        <p className="text-center text-sm leading-relaxed text-gray-600">
          ยินดีต้อนรับสู่ระบบตรวจสอบคุณภาพน้ำบาดาลประจำตำบลสุรนารี เครื่องมือที่จะช่วยให้ท่าน 'เช็กให้ชัวร์ก่อนเจาะ' และ 'มั่นใจก่อนดื่ม'
        </p>
        <div className="mt-4 rounded-lg bg-green-50 p-3">
          <p className="text-center text-xs text-green-700">แตะที่เมนูด้านล่างเพื่อเริ่มต้นใช้งานได้เลยครับ</p>
        </div>
      </div>

      {/* Quick Info Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-3 rounded-lg bg-blue-100 p-2">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">ข้อมูลด่วน</h3>
            <p className="text-xs text-gray-600">บ่อน้ำในพื้นที่: 120 บ่อ | คุณภาพดี: 68 บ่อ</p>
          </div>
        </div>
      </div>
    </div>
  )
}
