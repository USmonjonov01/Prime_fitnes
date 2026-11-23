import { lazy } from "react"

// Har bir tomon alohida yuklanadi: mijoz admin kodini (diagramma kutubxonasi va boshqalar) yuklab olmaydi.
const AdminDashboard = lazy(() => import("../components/admins/Dashboard"))
const AdminProfile = lazy(() => import("../components/admins/Profile"))
const ClientDashboard = lazy(() => import("../components/clients/Dashboard"))
const ClientProfile = lazy(() => import("../components/clients/Profile"))

// Ichki tizimning ikki tomoni: manzil prefiksi (/admin, /client) va unga kira oladigan rollar.
export const AREAS = {
  admin: ["staff", "owner"],
  client: ["customer"],
}

// Rolga mos tomon. Noma'lum rol uchun null qaytadi (foydalanuvchi tizimga kirmagan hisoblanadi).
export const areaOf = (role) => Object.keys(AREAS).find((area) => AREAS[area].includes(role)) ?? null

// Kirgandan keyin rolga qarab olib boriladigan manzil: /admin/dashboard yoki /client/dashboard
export const homeOf = (role) => {
  const area = areaOf(role)
  return area ? `/${area}/dashboard` : null
}

// Menyu va ichki sahifalar. area manzil prefiksini, roles ko'rinishni belgilaydi.
// element: null bo'lsa menyuda ko'rinadi, lekin sahifasi hali yo'q.
const sidebar = [
  { id: "admin-dashboard", area: "admin", title: "Bosh panel", path: "/admin/dashboard", icon: "home",  group: "Kundalik ish", roles: ["staff", "owner"], element: AdminDashboard },
  { id: "admin-customers", area: "admin", title: "Mijozlar",   path: "/admin/customers", icon: "users", group: "Kundalik ish", roles: ["staff", "owner"], element: null },
  { id: "admin-reports",   area: "admin", title: "Hisobotlar", path: "/admin/reports",   icon: "chart", group: "Boshqaruv",    roles: ["owner"],          element: null },
  { id: "admin-profile",   area: "admin", title: "Profil",     path: "/admin/profile",   icon: "user",  group: "Hisob",        roles: ["staff", "owner"], element: AdminProfile },

  { id: "client-dashboard", area: "client", title: "Bosh sahifa", path: "/client/dashboard", icon: "home", roles: ["customer"], element: ClientDashboard },
  { id: "client-profile",   area: "client", title: "Profil",      path: "/client/profile",   icon: "user", roles: ["customer"], element: ClientProfile },
]
export default sidebar
