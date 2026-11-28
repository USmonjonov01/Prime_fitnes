import { Navigate } from "react-router-dom"
import { AREAS, homeOf } from "../utils/sidebar"
import { useSession } from "../utils/session"

// Tomonni (area) himoya qiladi. Token ham hisobga olinadi:
//  - sessiya tekshirilayotganda: hech narsa chizilmaydi
//  - token tiklanmasa yoki kirmagan bo'lsa: /login ga
//  - boshqa tomonga kirmoqchi bo'lsa: o'z bosh sahifasiga
// Haqiqiy himoya backendda (har so'rovda token va rol tekshiriladi).
const PrivateRoutes = ({ area, children }) => {
     const { status, user } = useSession()

     if (status === "checking") return null
     if (status !== "authed") return <Navigate to="/login" replace />
     if (!AREAS[area].includes(user.role)) return <Navigate to={homeOf(user.role)} replace />
     return children
}

// "/" va "/login" uchun: kirgan foydalanuvchi o'z paneliga o'tadi, kirmagan odam kutilgan sahifaga.
export const SessionRedirect = ({ guest, children }) => {
     const { status, user } = useSession()

     if (status === "checking") return null
     if (status === "authed") return <Navigate to={homeOf(user.role)} replace />
     return guest ? <Navigate to={guest} replace /> : children
}

export default PrivateRoutes