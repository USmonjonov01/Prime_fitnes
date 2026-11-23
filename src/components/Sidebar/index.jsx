import { useEffect, useState } from "react"
import {
     Backdrop, Brand, Logout, MenuButton, NavButton, NavGroup, NavLabel, Sidebar as Aside, TabButton, Tabbar, Topbar, UserBox,
} from "./style"

/* ------------------------------------------------------------------------------------------
   SIDEBAR: ichki tizimning navigatsiyasi. Faqat ko'rinish (UI): ma'lumot olish va routing bu yerda YO'Q,
   hammasi props orqali keladi. Menyu elementlari utils/sidebar.js dan, tanlov esa DashboardLayout dan keladi.

   Props:
     user          { full_name, role, code? }
     items         menyu [{ id, title, icon, group? }]
     activeId      hozir ochiq bo'lim id si
     onSelect(id)  menyudan bo'lim tanlanganda
     onLogout()    "Chiqish" bosilganda
     isCustomer    true bo'lsa telefonda pastki tab panel chiqadi, aks holda tepada panel va ochiladigan yon menyu

   Kompyuterda ikkala holatda ham doimiy chap menyu. Yon menyuning ochiq/yopiqligi (telefonda) shu yerning
   o'zida saqlanadi, chunki u boshqa hech kimga kerak emas.
------------------------------------------------------------------------------------------ */

const ICONS = {
     home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
     users: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21c0-4 3.6-6 8-6s8 2 8 6",
     user: "M16 8a4 4 0 11-8 0 4 4 0 018 0zM4 21c0-4 3.6-6 8-6s8 2 8 6",
     ticket: "M3 8a2 2 0 002-2h14a2 2 0 002 2v3a2 2 0 000 4v3a2 2 0 00-2 2H5a2 2 0 00-2-2v-3a2 2 0 000-4V8zM14 6v12",
     clock: "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
     chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
     wallet: "M3 7h15a3 3 0 013 3v7a3 3 0 01-3 3H6a3 3 0 01-3-3V7zm0 0l12-3v3M17 14h2",
     staff: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4",
     logout: "M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 8l-4 4 4 4M6 12h10",
     menu: "M4 7h16M4 12h16M4 17h16",
}

const Icon = ({ name }) => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={ICONS[name] ?? ICONS.home} />
     </svg>
)

const ROLE_LABEL = { customer: "Mijoz", staff: "Xodim", owner: "Zal egasi" }

// Menyuni "group" bo'yicha ketma-ket bo'limlarga ajratadi (group yo'q bo'lsa sarlavhasiz bitta bo'lim)
const groupItems = (items) => items.reduce((groups, item) => {
     const last = groups[groups.length - 1]
     if (last && last.name === item.group) last.items.push(item)
     else groups.push({ name: item.group, items: [item] })
     return groups
}, [])

const Sidebar = ({ user, items = [], activeId, onSelect, onLogout, isCustomer = false }) => {
     const [open, setOpen] = useState(false)
     const role = ROLE_LABEL[user?.role] ? user.role : "customer"

     // Telefonda yon menyu Escape bilan yopiladi
     useEffect(() => {
          if (!open) return
          const onKey = (e) => e.key === "Escape" && setOpen(false)
          document.addEventListener("keydown", onKey)
          return () => document.removeEventListener("keydown", onKey)
     }, [open])

     const select = (id) => {
          setOpen(false)
          onSelect?.(id)
     }

     return <>
          {!isCustomer && <Topbar>
               <MenuButton type="button" aria-label="Menyuni ochish" aria-expanded={open} aria-controls="dashboard-sidebar" onClick={() => setOpen(true)}>
                    <Icon name="menu" />
               </MenuButton>
               <Brand>PRIME <span>FIT</span></Brand>
          </Topbar>}

          {open && <Backdrop type="button" aria-label="Menyuni yopish" onClick={() => setOpen(false)} />}

          <Aside id="dashboard-sidebar" $open={open} $drawer={!isCustomer} aria-label="Asosiy menyu">
               <Brand>PRIME <span>FIT</span></Brand>

               <nav>
                    {groupItems(items).map(({ name, items: group }) => (
                         <NavGroup key={name ?? "main"}>
                              {name && <NavLabel>{name}</NavLabel>}
                              {group.map(({ id, title, icon }) => (
                                   <NavButton
                                        key={id}
                                        type="button"
                                        $active={id === activeId}
                                        aria-current={id === activeId ? "page" : undefined}
                                        onClick={() => select(id)}
                                   >
                                        <Icon name={icon} />
                                        {title}
                                   </NavButton>
                              ))}
                         </NavGroup>
                    ))}
               </nav>

               <UserBox>
                    <div>
                         <strong>{user?.full_name ?? "Foydalanuvchi"}</strong>
                         <span>{isCustomer && user?.code ? `Kod ${user.code}` : ROLE_LABEL[role]}</span>
                    </div>
                    <Logout type="button" aria-label="Chiqish" title="Chiqish" onClick={() => onLogout?.()}>
                         <Icon name="logout" />
                    </Logout>
               </UserBox>
          </Aside>

          {/* Mijozda telefonda menyu pastki panelda: bosh barmoq yetadigan joyda */}
          {isCustomer && <Tabbar aria-label="Asosiy menyu">
               {items.map(({ id, title, icon }) => (
                    <TabButton
                         key={id}
                         type="button"
                         $active={id === activeId}
                         aria-current={id === activeId ? "page" : undefined}
                         onClick={() => select(id)}
                    >
                         <Icon name={icon} />
                         <span>{title}</span>
                    </TabButton>
               ))}
          </Tabbar>}
     </>
}

export default Sidebar
