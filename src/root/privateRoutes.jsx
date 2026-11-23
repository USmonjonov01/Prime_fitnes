import { Navigate } from "react-router-dom"
import { AREAS, homeOf } from "../utils/sidebar"

// Tomonni (area) himoya qiladi:
//  - kirmagan yoki roli noma'lum foydalanuvchi: /login ga
//  - boshqa tomonga kirmoqchi bo'lgan foydalanuvchi: o'z bosh sahifasiga (mijoz /admin ga kirsa /client/dashboard ga)
// Diqqat: bu faqat interfeys himoyasi. Haqiqiy himoya backendda bo'lishi kerak (localStorage ni foydalanuvchi o'zgartira oladi).
// Buzilgan yozuv bo'lsa ham xato bermaydi, foydalanuvchi kirmagan hisoblanadi.
const readUser = () => {
     try {
          return JSON.parse(localStorage.getItem("userData"))
     } catch {
          return null
     }
}

const PrivateRoutes = ({ area, children }) => {
     const user = readUser()
     const home = user && homeOf(user.role)
     if (!home) return <Navigate to="/login" replace />
     if (!AREAS[area].includes(user.role)) return <Navigate to={home} replace />
     return children
}

export default PrivateRoutes