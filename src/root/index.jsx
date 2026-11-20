import { useEffect, useRef } from "react"
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Data from "../utils/navbar"
import Login from "../components/Login"
import Dashboard from "../components/Dashboard"
import PrivateRoutes from "./privateRoutes"
import sidebar from "../utils/sidebar"

// Sahifa almashganda tepaga qaytaradi. Manzilda #bo'lim bo'lsa (masalan /home#narxlar),
// boshqa sahifadan kelganda ham o'sha bo'limga olib boradi. Bir sahifa ichidagi #havolalarni
// brauzerning o'zi silliq suradi, shuning uchun ularga tegmaymiz.
const ScrollManager = () => {
     const { pathname, hash } = useLocation()
     const lastPath = useRef(null)

     useEffect(() => {
          if (lastPath.current === pathname) return
          lastPath.current = pathname

          const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
          if (target) target.scrollIntoView({ behavior: "instant" })
          else window.scrollTo({ top: 0, behavior: "instant" })
     }, [pathname, hash])

     return null
}

// Ochiq sahifalar (Bosh sahifa, Biz haqimizda, Xizmatlar) umumiy Navbar bilan chiqadi.
const PublicLayout = () => <>
     <ScrollManager />
     <Navbar />
     <Outlet />
</>

const DashboardLayout = () => {
     const user = JSON.parse(localStorage.getItem("userData"))   // keyin contextdan olasiz
     const { pathname } = useLocation()
     const navigate = useNavigate()
     const outlet = useOutlet()

     const items = sidebar.filter(i => i.roles.includes(user.role))
     const active = items.find(i => i.path === pathname)

     return <Dashboard
          user={user}
          items={items}
          activeId={active?.id}
          onSelect={(id) => navigate(items.find(i => i.id === id).path)}
          onLogout={() => { localStorage.removeItem("userData"); navigate("/login") }}
     >
          {outlet}
     </Dashboard>
}

const Root = () => {
     // TODO: ichki tizim (dashboard) tayyor bo'lgach, token bor foydalanuvchini
     // shu yerda /dashboard ga yo'naltiramiz va PrivateRoutes bilan himoyalaymiz.
     return <Routes>
          <Route element={<PublicLayout />}>
               <Route path="/" element={<Navigate to="/home" replace />} />
               {Data?.map(({ path, element: Element }) => (
                    <Route key={path} path={path} element={<Element />} />
               ))}
          </Route>

          <Route path="/dashboard" element={<PrivateRoutes><DashboardLayout /></PrivateRoutes>}>
               {sidebar.filter(i => i.element).map(({ path, element: Element }) => (
                    <Route key={path} path={path} element={<Element />} />
               ))}
          </Route>

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<h1>404 Not Found</h1>} />
     </Routes>
}

export default Root