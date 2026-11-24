import { createContext, useContext, useEffect, useReducer } from "react";
import { message } from "antd";
import { reducer } from "./reducer";

const Notification = createContext()

export const NotificationData = () => useContext(Notification)

// Hamma so'rov bitta kalit bilan ko'rsatiladi: pending ("Yuklanmoqda...") javob kelgach shu joyning o'zida
// success yoki error ga almashadi, ekranda bir vaqtda ikkita bildirishnoma to'planib qolmaydi.
const KEY = "request"

const NotificationContext = ({ children }) => {
     const data = useReducer(reducer, null)
     const state = data[0]
     const [api, holder] = message.useMessage()

     // State har o'zgarganda (id oshadi) mos antd message ko'rsatiladi
     useEffect(() => {
          if (!state) {
               api.destroy(KEY) // CLEAR
               return
          }

          const { status, method, message: content } = state
          if (status === "pending") api.open({ key: KEY, type: "loading", content, duration: 0 })
          else if (status === "error") api.open({ key: KEY, type: "error", content, duration: 5 })
          else if (method === "GET") api.destroy(KEY) // GET muvaffaqiyati: bildirishnoma ko'rsatilmaydi, faqat "yuklanmoqda" yopiladi
          else api.open({ key: KEY, type: "success", content, duration: 3 })
     }, [state, api])

     return <Notification.Provider value={data}>
          {holder}
          {children}
     </Notification.Provider>
}

export default NotificationContext
