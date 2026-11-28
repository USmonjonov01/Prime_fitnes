import { useEffect, useRef, useState } from "react"
import { Badge, Box, CodeInput, Ghost, Head, Hint, Note, Primary, Row } from "./style"
import api, { apiMessage } from "../../axios"

// Mijozning telefon raqamini SMS kod bilan tasdiqlash. Tasdiqlash majburiy emas: mijoz tasdiqlanmasa ham ishlayveradi.
//   POST /phone/customers/:id/send-code   mijozning raqamiga 6 xonali kod yuboradi
//   POST /phone/customers/:id/verify      { code } mijoz aytgan kodni tekshiradi
// customer: { id, phone_number, phone_verified }. Tasdiqlangach onVerified() chaqiriladi (ro'yxatdagi belgini yangilash uchun).
// Xabarlar modal ichida, matn bilan ko'rsatiladi: antd bildirishnomalari <dialog> ning orqasida qolib ketadi.

const PhoneVerify = ({ customer, onVerified }) => {
     const [verified, setVerified] = useState(Boolean(customer.phone_verified))
     const [sentTo, setSentTo] = useState(null) // kod yuborilgan niqoblangan raqam; null: hali yuborilmagan
     const [code, setCode] = useState("")
     const [wait, setWait] = useState(0) // qayta yuborishgacha qolgan soniya
     const [busy, setBusy] = useState(false)
     const [note, setNote] = useState(null) // { tone: "ok" | "error", text }
     const [focusTick, setFocusTick] = useState(0) // kod yuborilgach maydonga fokus beriladi
     const inputRef = useRef(null)

     useEffect(() => {
          if (wait <= 0) return undefined
          const timer = setTimeout(() => setWait((n) => n - 1), 1000)
          return () => clearTimeout(timer)
     }, [wait])

     useEffect(() => {
          if (focusTick) inputRef.current?.focus()
     }, [focusTick])

     const fail = (error, fallback) => {
          const info = error?.response?.data?.error
          if (info?.code === "CODE_COOLDOWN" && info.details?.retry_after) setWait(info.details.retry_after)
          if (info?.code === "ALREADY_VERIFIED") { setVerified(true); onVerified?.(); return }
          const text = error?.response ? apiMessage(error, fallback) : "Serverga ulanib bo'lmadi. Internetni tekshiring."
          const left = info?.details?.attempts_left
          setNote({ tone: "error", text: left ? `${text}. Qolgan urinishlar: ${left}` : text })
     }

     const sendCode = async () => {
          setBusy(true)
          setNote(null)
          try {
               const { data } = await api.post(`/phone/customers/${customer.id}/send-code`)
               setSentTo(data.sent_to)
               setWait(data.resend_in)
               setCode("")
               setNote({ tone: "ok", text: "Kod yuborildi. Uni mijozdan so'rang." })
               setFocusTick((n) => n + 1)
          } catch (error) {
               fail(error, "Kodni yuborib bo'lmadi.")
          } finally {
               setBusy(false)
          }
     }

     const verify = async () => {
          if (code.length !== 6 || busy) return
          setBusy(true)
          setNote(null)
          try {
               await api.post(`/phone/customers/${customer.id}/verify`, { code })
               setVerified(true)
               onVerified?.()
          } catch (error) {
               fail(error, "Kodni tekshirib bo'lmadi.")
               setCode("")
               setFocusTick((n) => n + 1)
          } finally {
               setBusy(false)
          }
     }

     if (verified) {
          return <Box $tone="ok" aria-label="Telefon tasdiqlash">
               <Head>
                    <strong>Telefon raqami</strong>
                    <Badge $tone="ok">Tasdiqlangan</Badge>
               </Head>
          </Box>
     }

     return <Box aria-label="Telefon tasdiqlash">
          <Head>
               <strong>Telefon raqamini tasdiqlash</strong>
               <Badge $tone="warn">Tasdiqlanmagan</Badge>
          </Head>

          {!sentTo
               ? <>
                    <Hint>{customer.phone_number} raqamiga 6 xonali kod SMS qilib yuboriladi. Mijoz kodni aytadi, siz shu yerga yozasiz.</Hint>
                    <Row>
                         <Primary type="button" disabled={busy} onClick={sendCode}>{busy ? "Yuborilmoqda..." : "Kod yuborish"}</Primary>
                    </Row>
               </>
               : <>
                    <Hint>Kod {sentTo} raqamiga yuborildi. 5 daqiqa amal qiladi.</Hint>
                    <Row>
                         <CodeInput
                              ref={inputRef}
                              aria-label="SMS kod"
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              placeholder="000000"
                              value={code}
                              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              // Bu blok boshqa formaning ichida bo'lishi mumkin: Enter butun formani yubormasin
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); verify() } }}
                         />
                         <Primary type="button" disabled={busy || code.length !== 6} onClick={verify}>Tasdiqlash</Primary>
                    </Row>
                    <Row>
                         <Ghost type="button" disabled={busy || wait > 0} onClick={sendCode}>
                              {wait > 0 ? `Qayta yuborish: ${wait} s` : "Kodni qayta yuborish"}
                         </Ghost>
                    </Row>
               </>}

          <Note role="status" aria-live="polite" $tone={note?.tone}>{note?.text ?? ""}</Note>
     </Box>
}

export default PhoneVerify