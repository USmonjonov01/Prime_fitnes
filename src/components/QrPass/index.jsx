import { useEffect, useMemo, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Bar, Box, Note, Pass, Placeholder, Retry } from "./style"
import api from "../../axios"

/* ------------------------------------------------------------------------------------------
   MIJOZNING KIRISH QR KODI.
   Server har safar yangi, imzolangan va 45 soniyada eskiradigan kod beradi (GET /me/qr).
   Telefon uni ~30 soniyada o'zi yangilaydi. Shuning uchun skrinshot yoki surat bir daqiqadan keyin yaramaydi
   va kodni faqat mijozning o'z akkauntiga kirgan telefoni ko'rsata oladi.

   active   abonement faolmi: faol bo'lmasa QR ko'rsatilmaydi va server so'rovi yuborilmaydi
------------------------------------------------------------------------------------------ */

const TTL_SEC = 45
const REFRESH_EARLY_MS = 15000 // tugashiga 15 soniya qolganda yangilanadi (ya'ni har ~30 soniyada)
const RETRY_AFTER_MS = 5000 // xato bo'lsa serverni urib yubormaslik uchun

const QrPass = ({ active }) => {
     const [pass, setPass] = useState(null) // { token, expiresAt }: expiresAt shu qurilma soatida (server soatiga bog'liq emas)
     const [failed, setFailed] = useState(false)
     const [now, setNow] = useState(() => Date.now())
     const [attempt, setAttempt] = useState(0) // "Qayta urinish" tugmasi

     useEffect(() => {
          if (!active) return
          let alive = true
          let loading = false
          let expiresAt = 0
          let nextTry = 0

          const load = async () => {
               if (loading || Date.now() < nextTry) return
               loading = true
               try {
                    const { data } = await api.get("/me/qr")
                    if (!alive) return
                    expiresAt = Date.now() + data.expires_in * 1000
                    setPass({ token: data.token, expiresAt })
                    setFailed(false)
               } catch {
                    nextTry = Date.now() + RETRY_AFTER_MS
                    if (alive) setFailed(true)
               } finally {
                    loading = false
               }
          }

          load()
          const timer = setInterval(() => {
               setNow(Date.now())
               if (document.visibilityState === "visible" && expiresAt - Date.now() < REFRESH_EARLY_MS) load()
          }, 1000)
          // Telefon qulfdan chiqqanda eski kod ko'rinib qolmasin: darhol yangilanadi
          const onVisible = () => { if (document.visibilityState === "visible") { nextTry = 0; load() } }
          document.addEventListener("visibilitychange", onVisible)

          return () => {
               alive = false
               clearInterval(timer)
               document.removeEventListener("visibilitychange", onVisible)
          }
     }, [active, attempt])

     const qr = useMemo(
          () => (pass ? <QRCodeSVG value={pass.token} size={256} level="M" marginSize={0} title="Zalga kirish uchun QR kod" /> : null),
          [pass],
     )

     if (!active) {
          return <Pass aria-labelledby="qr-title">
               <h2 id="qr-title">Kirish QR kodi</h2>
               <Note>Abonementingiz faol bo'lganda zalga kirish QR kodi shu yerda ko'rinadi.</Note>
          </Pass>
     }

     const left = pass ? Math.max(0, Math.ceil((pass.expiresAt - now) / 1000)) : 0

     return <Pass aria-labelledby="qr-title">
          <h2 id="qr-title">Kirish QR kodi</h2>

          {left > 0
               ? <>
                    <Box>{qr}</Box>
                    <Bar aria-hidden="true" $ratio={left / TTL_SEC} $low={left <= 10} />
                    <Note>Zalga kirganda administratorga ko'rsating. Kod xavfsizlik uchun o'zi yangilanadi, uni boshqa odamga yuborish foyda bermaydi.</Note>
               </>
               : <Placeholder role="status">
                    <span>{failed ? "QR kodni yangilab bo'lmadi. Internetni tekshiring." : "QR kod tayyorlanmoqda..."}</span>
                    {failed && <Retry type="button" onClick={() => setAttempt((n) => n + 1)}>Qayta urinish</Retry>}
               </Placeholder>}
     </Pass>
}

export default QrPass