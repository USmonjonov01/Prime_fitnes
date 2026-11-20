import Dashboard from "../components/Dashboard"

const sidebar = [
  { id: "overview",  title: "Bosh panel",       path: "/dashboard",           icon: "home",   group: "Kundalik ish", roles: ["staff", "owner"] },
  { id: "customers", title: "Mijozlar",         path: "/dashboard/customers", icon: "users",  group: "Kundalik ish", roles: ["staff", "owner"], element: null },
  { id: "reports",   title: "Hisobotlar",       path: "/dashboard/reports",   icon: "chart",  group: "Boshqaruv",    roles: ["owner"],          element: null },
]
export default sidebar   