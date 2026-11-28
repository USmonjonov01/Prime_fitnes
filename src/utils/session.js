     import { useEffect, useState } from "react"
import { getAccessToken, refreshSession } from "../axios"
import { homeOf } from "./sidebar"

/* SESSIYA: kim kirgan va tokeni bormi?
   - userData (localStorage): faqat interfeys uchun. Unga ishonib bo'lmaydi.
   - access token: xotirada. Sahifa yangilansa yo'qoladi.
   - refresh token: httpOnly cookie. Access token yo'q bo'lsa shu bilan serverdan yangisi olinadi. */

export const readUser = () => {
     try {
          return JSON.parse(localStorage.getItem("userData"))
     } catch {
          return null
     }
}

export const saveUser = (user) => {
     const saved = { id: user.id, full_name: user.full_name, phone_number: user.phone_number, role: user.role }
     if (user.code) saved.code = user.code
     localStorage.setItem("userData", JSON.stringify(saved))
     return saved
}

export const clearUser = () => localStorage.removeItem("userData")

const validUser = () => {
     const user = readUser()
     return user && homeOf(user.role) ? user : null
}

let restoring = null

// Token bor bo'lsa darhol, bo'lmasa refresh cookie orqali tekshiradi. Natija: foydalanuvchi yoki null.
// 401/403 bo'lsa userData o'chadi. Tarmoq xatosi yoki 5xx bo'lsa saqlanadi.
export const restoreSession = () => {
     const stored = validUser()
     if (!stored) return Promise.resolve(null)
     if (getAccessToken()) return Promise.resolve(stored)

     restoring ??= refreshSession()
          .then(({ user }) => (user && homeOf(user.role) ? saveUser(user) : null))
          .catch((error) => {
               const status = error?.response?.status
               if (status === 401 || status === 403) clearUser()
               return null
          })
          .finally(() => { restoring = null })
     return restoring
}

// status: "checking" | "authed" | "guest"
export const useSession = () => {
     const [session, setSession] = useState(() => {
          const stored = validUser()
          if (!stored) return { status: "guest", user: null }
          if (getAccessToken()) return { status: "authed", user: stored }
          return { status: "checking", user: stored }
     })

     useEffect(() => {
          if (session.status !== "checking") return
          let cancelled = false
          restoreSession().then((user) => {
               if (!cancelled) setSession(user ? { status: "authed", user } : { status: "guest", user: null })
          })
          return () => { cancelled = true }
     }, [])   // eslint-disable-line react-hooks/exhaustive-deps

     return session
}