import { useEffect, useMemo, useState } from "react"
import { Feed, FeedEmpty, FeedHead, FeedItem, FeedList } from "./style"
import { describe } from "../../context/messages/reducer"
import api from "../../axios"

/* ------------------------------------------------------------------------------------------
   VOQEALAR LENTASI: serverdagi voqealar (kirish, rad etilgan kirish, yangi mijoz, abonement sotuvi, holat o'zgarishi).
   Voqealar bazada saqlanadi, shuning uchun bir xodim qilgan amalni boshqa xodimlar ham ko'radi,
   mijoz esa faqat o'ziga tegishlisini ko'radi.

   url         GET /activity (xodim va ega) yoki GET /me/activity (mijoz)
   audience    "admin" | "client": matn shu auditoriya uchun tanlanadi (context/messages/reducer dagi describe)
   refreshKey  qiymati o'zgarsa darhol qayta yuklanadi (masalan, kirish belgilangandan keyin)
   showActor   voqeani qaysi xodim bajarganini ko'rsatish (faqat admin tomonda)
   Har 20 soniyada o'zi yangilanadi (sahifa ko'rinib turgandagina).
------------------------------------------------------------------------------------------ */

const REFRESH_MS = 20000
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]
const pad = (n) => String(n).padStart(2, "0")

// Bugungi voqea: "14:30". Eskisi: "25-noyabr, 14:30"
const whenOf = (iso, now = new Date()) => {
     const d = new Date(iso)
     if (Number.isNaN(d.getTime())) return ""
     const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`
     const today = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
     return today ? time : `${d.getDate()}-${MONTHS[d.getMonth()]}, ${time}`
}

const ActivityFeed = ({ url, audience, title = "So'nggi voqealar", refreshKey = 0, showActor = false }) => {
     const [items, setItems] = useState(null)
     const [failed, setFailed] = useState(false)

     useEffect(() => {
          let alive = true
          const load = async () => {
               try {
                    const { data } = await api.get(url)
                    if (!alive) return
                    setItems(data)
                    setFailed(false)
               } catch {
                    if (alive) setFailed(true) // eski ro'yxat turaveradi
               }
          }
          load()
          const timer = setInterval(() => { if (document.visibilityState === "visible") load() }, REFRESH_MS)
          return () => { alive = false; clearInterval(timer) }
     }, [url, refreshKey])

     const entries = useMemo(() => (items ?? [])
          .map((a) => ({ a, text: describe(a.type, { client: a.client, ...a.data }, audience) }))
          .filter((entry) => entry.text)
          .slice(0, 20), [items, audience])

     return <Feed aria-labelledby="activity-title">
          <FeedHead>
               <h2 id="activity-title">{title}</h2>
               {failed && <small role="status">Yangilab bo'lmadi, eski ma'lumot ko'rsatilmoqda</small>}
          </FeedHead>

          {!items && !failed && <FeedEmpty>Yuklanmoqda...</FeedEmpty>}
          {items && !entries.length && <FeedEmpty>Hozircha voqea yo'q.</FeedEmpty>}

          {entries.length > 0 && <FeedList>
               {entries.map(({ a, text }) => (
                    <FeedItem key={a.id} $kind={text.kind}>
                         <strong>{text.title}</strong>
                         <p>{text.text}</p>
                         <time dateTime={a.at}>{whenOf(a.at)}{showActor && a.by ? ` · ${a.by}` : ""}</time>
                    </FeedItem>
               ))}
          </FeedList>}
     </Feed>
}

export default ActivityFeed
