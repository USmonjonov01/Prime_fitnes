import { useEffect, useRef, useState } from "react"
import jsQR from "jsqr"
import { Aim, Frame, Problem, Scanner, State } from "./style"

/* ------------------------------------------------------------------------------------------
   KAMERA ORQALI QR SKANERLASH (admin va xodim uchun). Telefon yoki noutbuk kamerasi, qo'shimcha qurilma shart emas.

   onScan(text)  QR dan o'qilgan matn. Tekshirishni server qiladi: bu yerda faqat o'qiladi.
   paused        true bo'lsa kadrlar o'qilmaydi (oldingi mijoz hali tekshirilmoqda)

   Kamera faqat HTTPS (yoki localhost) orqali ochiladi. Komponent yopilganda kamera o'chadi.
   Bir xil QR ni ketma-ket yubormaslik: aynan shu matn 60 soniya, shu mijozning yangi kodi esa 6 soniya e'tiborga olinmaydi.
------------------------------------------------------------------------------------------ */

const SCAN_EVERY_MS = 120 // sekundiga ~8 kadr: yetarli va telefonni qizdirmaydi
const MAX_WIDTH = 640 // katta kadr kerak emas, kichraytirib o'qiladi
const SAME_TEXT_MS = 60000
const SAME_PERSON_MS = 6000

// "PF1.<mijoz id>.<muddat>.<imzo>": mijoz id sini ajratib olish (faqat takrorni filtrlash uchun, ishonch uchun emas)
const personOf = (text) => (text.startsWith("PF1.") ? text.split(".")[1] : null)

const problemText = (err) => {
     if (err?.name === "NotAllowedError") return "Kameraga ruxsat berilmadi. Brauzer manzil qatoridagi qulf belgisidan kameraga ruxsat bering."
     if (err?.name === "NotFoundError") return "Kamera topilmadi. Kodni qo'lda yozing."
     if (err?.name === "NotReadableError") return "Kamera boshqa dastur tomonidan band. Uni yopib, qayta urinib ko'ring."
     return "Kamerani ochib bo'lmadi. Kodni qo'lda yozing."
}

const QrScanner = ({ onScan, paused = false }) => {
     const videoRef = useRef(null)
     const canvasRef = useRef(null)
     const pausedRef = useRef(paused)
     const onScanRef = useRef(onScan)
     const seen = useRef({ texts: new Map(), people: new Map() })
     const [problem, setProblem] = useState("")
     const [ready, setReady] = useState(false)

     // Eng so'nggi props larni ref ga yozamiz: kamera effekti qayta ishga tushmasin
     useEffect(() => {
          pausedRef.current = paused
          onScanRef.current = onScan
     })

     useEffect(() => {
          let alive = true
          let stream = null
          let frame = 0
          let last = 0

          const start = async () => {
               if (!navigator.mediaDevices?.getUserMedia) {
                    setProblem("Bu brauzer kamerani qo'llamaydi yoki sahifa HTTPS orqali ochilmagan. Kodni qo'lda yozing.")
                    return
               }
               try {
                    stream = await navigator.mediaDevices.getUserMedia({
                         video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
                         audio: false,
                    })
               } catch (err) {
                    if (alive) setProblem(problemText(err))
                    return
               }
               if (!alive) { stream.getTracks().forEach((t) => t.stop()); return }

               const video = videoRef.current
               video.srcObject = stream
               try { await video.play() } catch { /* effekt tozalanganda play to'xtatiladi */ }
               if (!alive) return
               setReady(true)

               const canvas = canvasRef.current
               const ctx = canvas.getContext("2d", { willReadFrequently: true })

               const tick = (time) => {
                    if (!alive) return
                    frame = requestAnimationFrame(tick)
                    if (time - last < SCAN_EVERY_MS || video.readyState < 2 || !video.videoWidth) return
                    last = time

                    const scale = Math.min(1, MAX_WIDTH / video.videoWidth)
                    canvas.width = Math.round(video.videoWidth * scale)
                    canvas.height = Math.round(video.videoHeight * scale)
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                    const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const found = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" })
                    if (!found?.data || pausedRef.current) return

                    const text = found.data
                    const now = Date.now()
                    const person = personOf(text)
                    const { texts, people } = seen.current
                    if (now - (texts.get(text) ?? 0) < SAME_TEXT_MS) return
                    if (person && now - (people.get(person) ?? 0) < SAME_PERSON_MS) return

                    texts.set(text, now)
                    if (person) people.set(person, now)
                    navigator.vibrate?.(60)
                    onScanRef.current?.(text)
               }
               frame = requestAnimationFrame(tick)
          }

          start()
          return () => {
               alive = false
               cancelAnimationFrame(frame)
               stream?.getTracks().forEach((t) => t.stop())
          }
     }, [])

     return <Scanner>
          {problem
               ? <Problem role="alert">{problem}</Problem>
               : <>
                    <Frame>
                         <video ref={videoRef} playsInline muted aria-label="Kamera tasviri" />
                         <Aim aria-hidden="true" />
                    </Frame>
                    <State role="status">{ready ? "Kamera tayyor. Mijozning QR kodini ramkaga to'g'rilang." : "Kamera ochilmoqda..."}</State>
               </>}
          <canvas ref={canvasRef} hidden />
     </Scanner>
}

export default QrScanner