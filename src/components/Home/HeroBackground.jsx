import { useEffect, useRef, useState } from "react"
import { HeroMedia, HeroScrim, HeroTint, HeroVideo } from "./style"

// Orqa fon videolari. Asl fayllar (4K, 60 MB) src/assets/videos/ da turadi, bu yerda esa
// ulardan tayyorlangan yengil nusxalar (jami ~6 MB) ishlatiladi: src/assets/videos/hero/.
import hero1 from "../../assets/videos/hero/hero-1.mp4"
import hero2 from "../../assets/videos/hero/hero-2.mp4"
import hero3 from "../../assets/videos/hero/hero-3.mp4"

const VIDEOS = [hero1, hero2, hero3]
const PLAYS_PER_VIDEO = 3 // har video shuncha marta takrorlanib, keyingisiga o'tadi

// Harakatni kamaytirishni yoqqan yoki trafikni tejayotgan foydalanuvchiga video yuklanmaydi,
// u zal gradientini ko'radi.
const skipVideo = () =>
     window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.connection?.saveData === true

const HeroBackground = () => {
     const [enabled] = useState(() => !skipVideo())
     const [active, setActive] = useState(0)
     const [visible, setVisible] = useState(true)
     const rootRef = useRef(null)
     const videos = useRef([])
     const plays = useRef(0)

     // Hero ekrandan chiqib ketsa yoki tab yashirilsa video to'xtaydi (batareya va protsessorni tejaydi)
     useEffect(() => {
          if (!enabled) return
          let inView = true
          const update = () => setVisible(inView && !document.hidden)

          const observer = new IntersectionObserver(([entry]) => {
               inView = entry.isIntersecting
               update()
          })
          observer.observe(rootRef.current)
          document.addEventListener("visibilitychange", update)

          return () => {
               observer.disconnect()
               document.removeEventListener("visibilitychange", update)
          }
     }, [enabled])

     // Faqat faol video ijro etiladi, qolganlari to'xtab turadi (oxirgi kadrida, shuning uchun o'tish silliq)
     useEffect(() => {
          if (!enabled) return
          videos.current.forEach((video, i) => {
               if (!video) return
               video.muted = true
               if (i === active && visible) video.play().catch(() => {})
               else video.pause()
          })
     }, [enabled, active, visible])

     if (!enabled) return null

     const goNext = (from) => {
          plays.current = 0
          const next = (from + 1) % VIDEOS.length
          const nextVideo = videos.current[next]
          if (nextVideo) nextVideo.currentTime = 0
          setActive(next)
     }

     const handleEnded = (index) => {
          if (index !== active) return
          plays.current += 1

          if (plays.current < PLAYS_PER_VIDEO) {
               const video = videos.current[index]
               video.currentTime = 0
               video.play().catch(() => {})
               return
          }
          goNext(index)
     }

     const next = (active + 1) % VIDEOS.length

     return <>
          <HeroMedia ref={rootRef} aria-hidden="true">
               {VIDEOS.map((src, i) => (
                    <HeroVideo
                         key={src}
                         ref={(el) => { videos.current[i] = el }}
                         src={src}
                         $active={i === active}
                         muted
                         playsInline
                         disablePictureInPicture
                         tabIndex={-1}
                         // faqat hozirgi va keyingi video oldindan yuklanadi
                         preload={i === active || i === next ? "auto" : "none"}
                         onEnded={() => handleEnded(i)}
                         onError={() => i === active && goNext(i)}
                    />
               ))}
          </HeroMedia>
          <HeroTint />
          <HeroScrim />
     </>
}

export default HeroBackground
