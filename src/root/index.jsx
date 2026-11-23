import { Suspense, useEffect, useRef } from "react"
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Data from "../utils/navbar"
import Login from "../components/Login"
import Sidebar from "../components/Sidebar"
import { Content, Main, Shell } from "../components/Sidebar/style"
import PrivateRoutes from "./privateRoutes"
import sidebar, { AREAS } from "../utils/sidebar"

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
const DashboardLayout = () => {
     const user = JSON.parse(localStorage.getItem("userData"))   // keyin contextdan olasiz
     const { pathname } = useLocation()
     const navigate = useNavigate()

     const items = sidebar.filter(i => i.roles.includes(user.role))
     const active = items.find(i => i.path === pathname)
     const isCustomer = user.role === "customer"

     return <Shell>
          <Sidebar
               user={user}
               items={items}
               activeId={active?.id}
               isCustomer={isCustomer}
               onSelect={(id) => navigate(items.find(i => i.id === id).path)}
               onLogout={() => { localStorage.removeItem("userData"); navigate("/login") }}
          />
          <Main>
               <Content $narrow={isCustomer}>
                    <Suspense fallback={null}>
                         <Outlet context={{ user }} />
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