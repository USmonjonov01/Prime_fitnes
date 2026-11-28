import { useEffect, useState } from "react"
import Data from "../../utils/navbar"
import { readUser } from "../../utils/session"
import { homeOf } from "../../utils/sidebar"
import { Brand, Burger, Bar, Header, Links, LoginLink, MobileLink, MobilePanel, NavItem } from "./style"

const Navbar = function () {
     const [open, setOpen] = useState(false)
     const [scrolled, setScrolled] = useState(() => window.scrollY > 24)

     // Sahifa pastga surilganda Navbar fonli bo'ladi
     useEffect(() => {
          const onScroll = () => setScrolled(window.scrollY > 24)
          window.addEventListener("scroll", onScroll, { passive: true })
          return () => window.removeEventListener("scroll", onScroll)
     }, [])

     // Telefondagi menyu Escape bilan yopiladi
     useEffect(() => {
          if (!open) return
          const onKey = (e) => e.key === "Escape" && setOpen(false)
          window.addEventListener("keydown", onKey)
          return () => window.removeEventListener("keydown", onKey)
     }, [open])

     const close = () => setOpen(false)
     // Kirgan foydalanuvchiga "Kirish" o'rniga o'z paneliga havola ko'rsatiladi
     const home = homeOf(readUser()?.role)

     return <Header $solid={scrolled || open}>
          <Bar>
               {/* TODO: logo tayyor bo'lgach shu yerga qo'yiladi */}
               <Brand to="/home" onClick={close} aria-label="Gym Prime Fit, bosh sahifa">
                    PRIME <span>FITNES</span>
               </Brand>

               <Links aria-label="Asosiy menyu">
                    {Data.map(({ title, path }) => (
                         <NavItem key={path} to={path}>{title}</NavItem>
                    ))}
               </Links>

               <LoginLink to={home ?? "/login"}>{home ? "Kabinet" : "Kirish"}</LoginLink>

               <Burger
                    type="button"
                    $open={open}
                    aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
                    aria-expanded={open}
                    aria-controls="mobil-menyu"
                    onClick={() => setOpen((v) => !v)}
               >
                    <span />
                    <span />
                    <span />
               </Burger>
          </Bar>

          {open && (
               <MobilePanel id="mobil-menyu" aria-label="Mobil menyu">
                    {Data.map(({ title, path }) => (
                         <MobileLink key={path} to={path} onClick={close}>{title}</MobileLink>
                    ))}
               </MobilePanel>
          )}
     </Header>
}

export default Navbar