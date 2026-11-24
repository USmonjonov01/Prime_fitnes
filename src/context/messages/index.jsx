import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { notification } from "antd";
import reducer from "./reducer";
import { AdminData } from "../admins";
import { ClientData } from "../clients";

const Message = createContext()

export const MessageData = ()=> useContext(Message)

// Xabar shu foydalanuvchiga tegishlimi: admin xabarlari xodim va egaga, mijoz xabarlari faqat o'sha mijozga
const isForUser = (m, user) => {
     if (!user) return false
     if (m.audience === "admin") return user.role === "staff" || user.role === "owner"
     return user.role === "customer" && String(m.clientId) === String(user.id)
}

const MessageContext = ({children})=> {
     const data = useReducer(reducer, null)
     const state = data[0]
     // Hozirgi foydalanuvchi: kirgan tomonning contextidan (Login ikkalasidan bittasiga yozadi, chiqishda ikkalasi tozalanadi)
     const [admin] = AdminData()
     const [client] = ClientData()
     const user = admin?.user ?? client?.user ?? null
     const [api, holder] = notification.useNotification({ placement: "topRight", showProgress: true, pauseOnHover: true })
     const shown = useRef(new Set()) // ko'rib chiqilgan xabarlar id si: bitta xabar ikki marta chiqmasligi uchun

     // Yangi kelgan xabarlar eskisidan yangisiga qarab, yuborilgan tartibda ko'rsatiladi
     useEffect(() => {
          const fresh = [...(state ?? [])].reverse().filter((m) => !shown.current.has(m.id))

          fresh.forEach((m) => {
               shown.current.add(m.id)
               if (m.read || !isForUser(m, user)) return
               api.open({ key: m.id, type: m.kind, title: m.title, description: m.text, duration: 6 })
          })
     }, [state, api, user])

     return <Message.Provider value={data}>
          {holder}
          {children}
     </Message.Provider>
}

export default MessageContext