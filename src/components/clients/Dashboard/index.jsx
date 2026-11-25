import { useCallback, useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import {
     Empty, EmptyLink, Fact, Facts, Greeting, List, ListItem, Panel, PanelTitle, Plan, PlanHead, Stamp, StampNote, Stamps,
     StatePill,
} from "./style"
import { PHONE, PHONE_VIEW } from "../../../utils/gym"
import { NotificationData } from "../../../context/notifications"
import { ClientData } from "../../../context/clients"
import api from "../../../axios"


const Icon = () => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
     </svg>
)

/* ------------------------------ Yordamchilar ------------------------------ */

// Brauzerlarda o'zbek tili ma'lumoti bo'lmasligi mumkin, shuning uchun oy nomlari qo'lda yozilgan
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]

const formatDate = (value) => {
     const date = new Date(value)
     if (Number.isNaN(date.getTime())) return String(value)
     return `${date.getDate()}-${MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}

const STATE = {
     active: { label: "Faol", tone: "ok" },
     finished: { label: "Tashriflar tugagan", tone: "warn" },
     expired: { label: "Muddati o'tgan", tone: "danger" },
     cancelled: { label: "Bekor qilingan", tone: "danger" },
}

/* ------------------------------ Ma'lumot olish (backend) ------------------------------ */
//   GET /me/dashboard   { abonement, history }: mijoz faqat o'zini ko'radi (id tokendan olinadi, URL dan emas)

const loadClient = async () => (await api.get("/me/dashboard")).data

/* ------------------------------ Mijoz: bosh sahifa ------------------------------ */

const ClientOverview = ({ user, data }) => {
     const { abonement, history } = data
     const left = abonement ? Math.max(0, abonement.visitTotal - abonement.visitUsed) : 0
     const state = abonement ? STATE[abonement.state] ?? STATE.active : null
     const firstName = user?.full_name?.split(" ")[0] ?? ""

     const stamps = abonement
          ? Array.from({ length: abonement.visitTotal }, (_, i) => (i < abonement.visitUsed ? "used" : i === abonement.visitUsed ? "next" : "empty"))
          : []

     return <>
          <Greeting>
               <h1>Salom{firstName ? `, ${firstName}` : ""}</h1>
               {user?.code && <p>Zalga kirganda kodingizni ayting: <strong>{user.code}</strong></p>}
          </Greeting>

          {abonement ? (
               <Plan aria-labelledby="plan-title">
                    <PlanHead>
                         <h2 id="plan-title">{abonement.name} abonement</h2>
                         <StatePill $tone={state.tone}>{state.label}</StatePill>
                    </PlanHead>

                    {/* Qog'oz kartadagi katakchalarning o'zi: har tashrif bitta belgi */}
                    <Stamps role="img" aria-label={`${abonement.visitTotal} ta tashrifdan ${abonement.visitUsed} tasi ishlatilgan`}>
                         {stamps.map((kind, i) => (
                              <Stamp key={i} $kind={kind}>
                                   {kind === "used" ? <Icon /> : i + 1}
                              </Stamp>
                         ))}
                    </Stamps>
                    <StampNote>Har tashrifda bitta katak to'ladi.</StampNote>

                    <Facts>
                         <Fact><strong>{left}</strong><span>tashrif qoldi</span></Fact>
                         <Fact><strong>{abonement.daysLeft}</strong><span>kun qoldi</span></Fact>
                         <Fact><strong>{formatDate(abonement.endDate)}</strong><span>gacha amal qiladi</span></Fact>
                    </Facts>
               </Plan>
          ) : (
               <Empty>
                    <h2>Faol abonementingiz yo'q</h2>
                    <p>Abonementni zalda administrator orqali olasiz.</p>
                    <EmptyLink href={`tel:${PHONE}`}>{PHONE_VIEW}</EmptyLink>
               </Empty>
          )}

          <Panel aria-labelledby="history-title">
               <PanelTitle id="history-title">Oxirgi tashriflar</PanelTitle>
               {history.length ? (
                    <List>
                         {history.map(({ id, date, time }) => (
                              <ListItem key={id}><strong>{date}</strong><time>{time}</time></ListItem>
                         ))}
                    </List>
               ) : <Empty as="p">Hozircha tashrif yo'q.</Empty>}
          </Panel>
     </>
}

/* ------------------------------ Dashboard ------------------------------ */

const Dashboard = ({ user: userProp, data }) => {
     const outlet = useOutletContext()
     const [, notify] = NotificationData()
     const [, clientDispatch] = ClientData()
     const user = userProp ?? outlet?.user
     const userId = user?.id
     const shown = data ?? outlet?.data // props bo'lmasa context/clients dagi ma'lumot
     const [failed, setFailed] = useState(false)

     // Ma'lumot serverdan olinadi va context/clients ga yoziladi. Allaqachon bor bo'lsa orqada, bildirishnomasiz yangilanadi
     const reload = useCallback(async (silent = false) => {
          if (!userId) return
          const entity = "Ma'lumotlar"
          if (!silent) notify({ type: "GET_pending", payload: { entity } })
          try {
               clientDispatch({ type: "SET_DATA", payload: await loadClient() })
               setFailed(false)
               if (!silent) notify({ type: "GET_success", payload: { entity } })
          } catch (error) {
               if (silent) return // eski ma'lumot turaveradi
               setFailed(true)
               notify({ type: "GET_error", payload: { entity, error } })
          }
     }, [userId, notify, clientDispatch])

     useEffect(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- serverdan ma'lumot olish: sahifa ochilganda bir marta
          if (!data) reload(Boolean(outlet?.data))
     }, [])   // eslint-disable-line react-hooks/exhaustive-deps

     if (!shown) {
          return failed
               ? <Empty>
                    <h2>Ma'lumotlarni yuklab bo'lmadi</h2>
                    <p>Internetni tekshirib, qayta urinib ko'ring.</p>
                    <EmptyLink as="button" type="button" onClick={() => reload()}>Qayta yuklash</EmptyLink>
               </Empty>
               : <Empty as="p">Ma'lumotlar yuklanmoqda...</Empty>
     }

     return <ClientOverview user={user} data={shown} />
}

export default Dashboard