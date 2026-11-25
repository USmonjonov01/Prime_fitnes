import { Suspense, useEffect, useRef, useState } from "react"
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Data from "../utils/navbar"
import Login from "../components/Login"
import Sidebar from "../components/Sidebar"
import { Content, Main, Shell } from "../components/Sidebar/style"
import PrivateRoutes from "./privateRoutes"
import sidebar, { AREAS } from "../utils/sidebar"
import { AdminData } from "../context/admins"
import { ClientData } from "../context/clients"
import api, { getAccessToken, refreshSession, setAccessToken } from "../axios"

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

// Ichki tizim karkasi (admin va mijoz uchun bitta): chapda Sidebar, o'ngda tanlangan bo'lim (Outlet).
// Public Navbar bu yerda chiqmaydi. Foydalanuvchi Outlet context orqali bo'limlarga uzatiladi.
// Sahifalar lazy yuklanadi, shuning uchun Suspense kerak.
const readStored = () => {
     try {
          return JSON.parse(localStorage.getItem("userData"))
     } catch {
          return null
     }
}

const DashboardLayout = () => {
     // Foydalanuvchi o'z tomonining contextidan olinadi. Sahifa yangilanganda context bo'sh bo'ladi,
     // shunda localStorage dagi userData dan tiklanadi (PrivateRoutes shu yozuvni tekshiradi).
     const [admin, adminDispatch] = AdminData()
     const [client, clientDispatch] = ClientData()
     const { pathname } = useLocation()
     const navigate = useNavigate()

     const stored = readStored()
     const isCustomer = stored?.role === "customer"
     const side = isCustomer ? client : admin
     const dispatch = isCustomer ? clientDispatch : adminDispatch
     const user = side?.user ?? stored

     useEffect(() => {
          if (stored && !side?.user) dispatch({ type: "LOGIN", payload: { user: stored } })
     }, [side?.user])   // eslint-disable-line react-hooks/exhaustive-deps

     // Access token xotirada turadi: sahifa yangilansa yo'qoladi. Cookie dagi refresh token bilan jimgina tiklanadi.
     // Tiklanmasa (sessiya tugagan yoki akkaunt bloklangan) login sahifasiga o'tadi.
     const [ready, setReady] = useState(Boolean(getAccessToken()))
     useEffect(() => {
          if (ready) return
          refreshSession()
               .then(() => setReady(true))
               .catch(() => {
                    localStorage.removeItem("userData")
                    navigate("/login", { replace: true })
               })
     }, [])   // eslint-disable-line react-hooks/exhaustive-deps

     // Chiqishdan keyin /login ga o'tish tugaguncha bir lahza foydalanuvchi yo'q: xato bermasdan bo'sh qoladi
     if (!user || !ready) return null

     const items = sidebar.filter(i => i.roles.includes(user.role))
     const active = items.find(i => i.path === pathname)

     return <Shell>
          <Sidebar
               user={user}
               items={items}
               activeId={active?.id}
               isCustomer={isCustomer}
               onSelect={(id) => navigate(items.find(i => i.id === id).path)}
               onLogout={async () => {
                    try { await api.post("/auth/logout") } catch { /* server javob bermasa ham chiqamiz */ }
                    setAccessToken(null)
                    adminDispatch({ type: "LOGOUT" })
                    clientDispatch({ type: "LOGOUT" })
                    localStorage.removeItem("userData")
                    navigate("/login")
               }}
          />
          <Main>
               <Content $narrow={isCustomer}>
                    <Suspense fallback={null}>
                         <Outlet context={{ user, data: side?.data, checkInResult: side?.checkInResult }} />
                    </Suspense>
               </Content>
          </Main>
     </Shell>
}

const Root = () => {
     return <Routes>
          <Route element={<PublicLayout />}>
               <Route path="/" element={<Navigate to="/home" replace />} />
               {Data?.map(({ path, element: Element }) => (
                    <Route key={path} path={path} element={<Element />} />
               ))}
          </Route>

          {/* Ichki tizim: har tomon o'z manzil prefiksi va o'z role guardiga ega */}
          {Object.keys(AREAS).map((area) => (
               <Route key={area} path={`/${area}`} element={<PrivateRoutes area={area}><DashboardLayout /></PrivateRoutes>}>
                    <Route index element={<Navigate to={`/${area}/dashboard`} replace />} />
                    {sidebar.filter(i => i.area === area && i.element).map(({ path, element: Element }) => (
                         <Route key={path} path={path} element={<Element />} />
                    ))}
               </Route>
          ))}

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<h1>404 Not Found</h1>} />
     </Routes>
}

export default Root