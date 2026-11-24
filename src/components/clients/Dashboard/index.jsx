import { useOutletContext } from "react-router-dom"
import {
     Empty, EmptyLink, Fact, Facts, Greeting, List, ListItem, Panel, PanelTitle, Plan, PlanHead, SampleNote, Stamp, StampNote, Stamps,
     StatePill,
} from "./style"
import { PHONE, PHONE_VIEW } from "../../../utils/gym"

/* ------------------------------------------------------------------------------------------
   CLIENTS / DASHBOARD: mijozning bosh sahifasi. Faqat mazmun: karkas va menyu bu yerda YO'Q
   (karkas root/index.jsx dagi DashboardLayout da, menyu components/Sidebar da).
   Ma'lumot olish va context ham yo'q, hammasi props orqali keladi.

   Foydalanuvchi va data props orqali berilmasa, DashboardLayout ning <Outlet context> idan olinadi (u context/clients dan keladi).

   Props:
     user    { full_name, code? }
     data    { abonement: { name, visitTotal, visitUsed, daysLeft, endDate, state } | null,
               history: [{ id, date, time }] }
             state: "active" | "finished" | "expired" | "cancelled"
             Berilmasa NAMUNA ma'lumot va izoh chiqadi
------------------------------------------------------------------------------------------ */

const Icon = () => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
     </svg>
)

/* ------------------------------ NAMUNA ma'lumot ------------------------------ */
// Haqiqiy ma'lumot props orqali kelmaguncha shu ko'rinadi.

const SAMPLE_CLIENT = {
     abonement: { name: "1 oylik", visitTotal: 15, visitUsed: 6, daysLeft: 31, endDate: "2026-12-30", state: "active" },
     history: [
          { id: 1, date: "18-noyabr", time: "18:42" },
          { id: 2, date: "16-noyabr", time: "19:05" },
          { id: 3, date: "14-noyabr", time: "18:20" },
          { id: 4, date: "12-noyabr", time: "17:55" },
     ],
}

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

/* ------------------------------ Mijoz: bosh sahifa ------------------------------ */

const ClientOverview = ({ user, data, isSample }) => {
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

          {isSample && <SampleNote>Namuna ma'lumot: haqiqiy ma'lumot ulanmagan.</SampleNote>}

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
     const user = userProp ?? outlet?.user
     const shown = data ?? outlet?.data // props bo'lmasa context/clients dagi ma'lumot, u ham bo'lmasa namuna

     return <ClientOverview user={user} data={shown ?? SAMPLE_CLIENT} isSample={!shown} />
}

export default Dashboard