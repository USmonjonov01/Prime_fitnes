import { useEffect, useRef, useState } from "react"
import {
     ActionButton, Actions, Backdrop, Brand, CodeInput, Columns, Console, ConsoleForm, ConsoleHint, ConsoleLabel,
     ConsoleSubmit, Content, DateText, Empty, EmptyLink, Fact, Facts, Figure, Figures, Greeting, List, ListItem, Logout,
     Main, MenuButton, NavButton, NavGroup, NavLabel, PageHead, PageTitle, Panel, PanelTitle, Pill, Plan, PlanHead,
     Result, SampleNote, Shell, Sidebar, Stamp, StampNote, Stamps, StatePill, TabButton, Tabbar, Topbar, UserBox,
} from "./style"
import { PHONE, PHONE_VIEW } from "../../utils/gym"

/* ------------------------------------------------------------------------------------------
   DASHBOARD: bitta komponent, role bo'yicha ikki xil ko'rinadi. Faqat ko'rinish (UI):
   ma'lumot olish, routing va context bu yerda YO'Q, hammasi props orqali keladi.

   Props (hammasi uchun):
     user          { full_name, role, code? }  role: "customer" | "staff" | "owner"
     items         menyu [{ id, title, icon, group? }]. Berilmasa role ga mos standart menyu olinadi
     activeId      hozir ochiq bo'lim id si
     onSelect(id)  menyudan bo'lim tanlanganda
     onLogout()    "Chiqish" bosilganda
     data          role ga mos ma'lumot (pastda). Berilmasa NAMUNA ma'lumot va izoh chiqadi
     children      berilsa bosh panel o'rniga shu chiqadi (boshqa bo'limlar sahifalari uchun)

   role "staff" va "owner" uchun qo'shimcha:
     onCheckIn(code)   kod kiritilib "Belgilash" bosilganda (Enter yoki QR skaner ham)
     checkInResult     { tone: "ok" | "error", message } oxirgi tekshiruv natijasi
     onAction(id)      tezkor tugmalar: "add-customer", "sell"
     data              { stats: { visitsToday, activeMembers, expiringSoon, incomeToday },
                         visits: [{ id, name, code, time }], expiring: [{ id, name, plan, note }] }

   role "customer" uchun:
     data              { abonement: { name, visitTotal, visitUsed, daysLeft, endDate, state } | null,
                         history: [{ id, date, time }] }
                       state: "active" | "finished" | "expired" | "cancelled"

   Ko'rinish farqlari role dan keladi: mijozda telefonda pastki tab panel, xodim va egada ochiladigan yon menyu;
   tushum va "Boshqaruv" bo'limi faqat "owner" ga.
------------------------------------------------------------------------------------------ */

const ICONS = {
     home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
     users: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21c0-4 3.6-6 8-6s8 2 8 6",
     user: "M16 8a4 4 0 11-8 0 4 4 0 018 0zM4 21c0-4 3.6-6 8-6s8 2 8 6",
     ticket: "M3 8a2 2 0 002-2h14a2 2 0 002 2v3a2 2 0 000 4v3a2 2 0 00-2 2H5a2 2 0 00-2-2v-3a2 2 0 000-4V8zM14 6v12",
     clock: "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
     chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
     wallet: "M3 7h15a3 3 0 013 3v7a3 3 0 01-3 3H6a3 3 0 01-3-3V7zm0 0l12-3v3M17 14h2",
     staff: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4",
     logout: "M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 8l-4 4 4 4M6 12h10",
     menu: "M4 7h16M4 12h16M4 17h16",
     plus: "M12 5v14M5 12h14",
     scan: "M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M7 12h10",
     check: "M5 12.5l4.5 4.5L19 7.5",
}

const Icon = ({ name }) => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={ICONS[name] ?? ICONS.home} />
     </svg>
)

/* ------------------------------ Standart menyular ------------------------------ */

const STAFF_ITEMS = [
     { id: "overview", title: "Bosh panel", icon: "home", group: "Kundalik ish" },
     { id: "customers", title: "Mijozlar", icon: "users", group: "Kundalik ish" },
     { id: "sell", title: "Abonement sotish", icon: "ticket", group: "Kundalik ish" },
     { id: "visits", title: "Tashriflar", icon: "clock", group: "Kundalik ish" },
]

const OWNER_ONLY_ITEMS = [
     { id: "reports", title: "Hisobotlar", icon: "chart", group: "Boshqaruv" },
     { id: "expenses", title: "Chiqimlar", icon: "wallet", group: "Boshqaruv" },
     { id: "staff", title: "Xodimlar", icon: "staff", group: "Boshqaruv" },
]

const ITEMS_BY_ROLE = {
     customer: [
          { id: "overview", title: "Bosh sahifa", icon: "home" },
          { id: "visits", title: "Tashriflarim", icon: "clock" },
          { id: "abonements", title: "Abonementlarim", icon: "ticket" },
          { id: "profile", title: "Profil", icon: "user" },
     ],
     staff: STAFF_ITEMS,
     owner: [...STAFF_ITEMS, ...OWNER_ONLY_ITEMS],
}

const ROLE_LABEL = { customer: "Mijoz", staff: "Xodim", owner: "Zal egasi" }

/* ------------------------------ NAMUNA ma'lumot ------------------------------ */
// Haqiqiy ma'lumot props orqali kelmaguncha shu ko'rinadi.

const SAMPLE_ADMIN = {
     stats: { visitsToday: 23, activeMembers: 118, expiringSoon: 6, incomeToday: 1450000 },
     visits: [
          { id: 1, name: "Jasur Karimov", code: "117", time: "18:42" },
          { id: 2, name: "Doniyor Ergashev", code: "052", time: "18:15" },
          { id: 3, name: "Sardor Aliyev", code: "204", time: "17:50" },
          { id: 4, name: "Bobur Tursunov", code: "091", time: "17:12" },
     ],
     expiring: [
          { id: 1, name: "Akmal Yusupov", plan: "1 oylik", note: "2 kun, 3 tashrif qoldi" },
          { id: 2, name: "Otabek Rahimov", plan: "1 oylik", note: "3 kun, 9 tashrif qoldi" },
          { id: 3, name: "Shahzod Nurmatov", plan: "3 oylik", note: "5 kun, 4 tashrif qoldi" },
     ],
}

const SAMPLE_CUSTOMER = {
     abonement: { name: "1 oylik", visitTotal: 15, visitUsed: 6, daysLeft: 31, endDate: "2026-12-30", state: "active" },
     history: [
          { id: 1, date: "18-noyabr", time: "18:42" },
          { id: 2, date: "16-noyabr", time: "19:05" },
          { id: 3, date: "14-noyabr", time: "18:20" },
          { id: 4, date: "12-noyabr", time: "17:55" },
     ],
}

/* ------------------------------ Yordamchilar ------------------------------ */

// Brauzerlarda o'zbek tili ma'lumoti bo'lmasligi mumkin, shuning uchun oy va hafta kunlari qo'lda yozilgan
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]
const WEEKDAYS = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"]

const today = () => {
     const now = new Date()
     return `${now.getDate()}-${MONTHS[now.getMonth()]}, ${WEEKDAYS[now.getDay()]}`
}

const formatDate = (value) => {
     const date = new Date(value)
     if (Number.isNaN(date.getTime())) return String(value)
     return `${date.getDate()}-${MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}

const money = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")

const STATE = {
     active: { label: "Faol", tone: "ok" },
     finished: { label: "Tashriflar tugagan", tone: "warn" },
     expired: { label: "Muddati o'tgan", tone: "danger" },
     cancelled: { label: "Bekor qilingan", tone: "danger" },
}

// Menyuni "group" bo'yicha ketma-ket bo'limlarga ajratadi (group yo'q bo'lsa sarlavhasiz bitta bo'lim)
const groupItems = (items) => items.reduce((groups, item) => {
     const last = groups[groups.length - 1]
     if (last && last.name === item.group) last.items.push(item)
     else groups.push({ name: item.group, items: [item] })
     return groups
}, [])

/* ------------------------------ Xodim va ega: bosh panel ------------------------------ */

const StaffOverview = ({ isOwner, data, isSample, onCheckIn, checkInResult, onAction }) => {
     const codeRef = useRef(null)
     const { stats, visits, expiring } = data

     const submitCode = (e) => {
          e.preventDefault()
          const code = codeRef.current.value.trim()
          if (!code) return codeRef.current.focus()
          onCheckIn?.(code)
          codeRef.current.value = ""
          codeRef.current.focus() // keyingi mijoz uchun tayyor (QR skaner ketma-ket o'qiydi)
     }

     return <>
          <PageHead>
               <PageTitle>Bosh panel</PageTitle>
               <DateText>{today()}</DateText>
          </PageHead>

          {isSample && <SampleNote>Namuna ma'lumot: haqiqiy ma'lumot ulanmagan.</SampleNote>}

          <Console aria-labelledby="console-title">
               <ConsoleLabel id="console-title">Kirishni belgilash</ConsoleLabel>
               <ConsoleForm onSubmit={submitCode}>
                    <CodeInput
                         ref={codeRef}
                         type="text"
                         autoComplete="off"
                         aria-labelledby="console-title"
                         placeholder="Mijoz kodi"
                    />
                    <ConsoleSubmit type="submit">
                         <Icon name="scan" />
                         Belgilash
                    </ConsoleSubmit>
               </ConsoleForm>
               <ConsoleHint>Kodni yozing yoki QR skanerdan o'qiting, Enter bossangiz belgilanadi.</ConsoleHint>
               {checkInResult && <Result role="status" $tone={checkInResult.tone}>{checkInResult.message}</Result>}
          </Console>

          <Figures aria-label="Bugungi ko'rsatkichlar">
               <Figure><strong>{stats.visitsToday}</strong><span>Bugungi tashriflar</span></Figure>
               <Figure><strong>{stats.activeMembers}</strong><span>Faol abonementlar</span></Figure>
               <Figure $warn={stats.expiringSoon > 0}><strong>{stats.expiringSoon}</strong><span>7 kunda tugaydi</span></Figure>
               {isOwner && <Figure><strong>{money(stats.incomeToday)}</strong><span>Bugungi tushum, so'm</span></Figure>}
          </Figures>

          <Columns>
               <Panel>
                    <PanelTitle>Oxirgi tashriflar</PanelTitle>
                    <List>
                         {visits.map(({ id, name, code, time }) => (
                              <ListItem key={id}>
                                   <div><strong>{name}</strong><span>Kod {code}</span></div>
                                   <time>{time}</time>
                              </ListItem>
                         ))}
                    </List>
               </Panel>

               <Panel>
                    <PanelTitle>Tez tugaydigan abonementlar</PanelTitle>
                    <List>
                         {expiring.map(({ id, name, plan, note }) => (
                              <ListItem key={id}>
                                   <div><strong>{name}</strong><span>{note}</span></div>
                                   <Pill>{plan}</Pill>
                              </ListItem>
                         ))}
                    </List>
               </Panel>
          </Columns>

          <Actions>
               <ActionButton type="button" onClick={() => onAction?.("add-customer")}>
                    <Icon name="plus" /> Mijoz qo'shish
               </ActionButton>
               <ActionButton type="button" onClick={() => onAction?.("sell")}>
                    <Icon name="ticket" /> Abonement sotish
               </ActionButton>
          </Actions>
     </>
}

/* ------------------------------ Mijoz: bosh sahifa ------------------------------ */

const CustomerOverview = ({ user, data, isSample }) => {
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
                                   {kind === "used" ? <Icon name="check" /> : i + 1}
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

const Dashboard = ({
     user, items, activeId = "overview", onSelect, onLogout, data, children, onCheckIn, checkInResult, onAction,
}) => {
     const [open, setOpen] = useState(false)
     const role = ITEMS_BY_ROLE[user?.role] ? user.role : "customer"
     const isCustomer = role === "customer"
     const isSample = !data
     const menu = items ?? ITEMS_BY_ROLE[role]

     // Xodim va egada telefonda menyu ochiladigan yon panel, Escape bilan yopiladi
     useEffect(() => {
          if (!open) return
          const onKey = (e) => e.key === "Escape" && setOpen(false)
          document.addEventListener("keydown", onKey)
          return () => document.removeEventListener("keydown", onKey)
     }, [open])

     const select = (id) => {
          setOpen(false)
          onSelect?.(id)
     }

     return <Shell>
          {!isCustomer && <Topbar>
               <MenuButton type="button" aria-label="Menyuni ochish" aria-expanded={open} aria-controls="dashboard-sidebar" onClick={() => setOpen(true)}>
                    <Icon name="menu" />
               </MenuButton>
               <Brand>PRIME <span>FIT</span></Brand>
          </Topbar>}

          {open && <Backdrop type="button" aria-label="Menyuni yopish" onClick={() => setOpen(false)} />}

          <Sidebar id="dashboard-sidebar" $open={open} $drawer={!isCustomer} aria-label="Asosiy menyu">
               <Brand>PRIME <span>FIT</span></Brand>

               <nav>
                    {groupItems(menu).map(({ name, items: group }) => (
                         <NavGroup key={name ?? "main"}>
                              {name && <NavLabel>{name}</NavLabel>}
                              {group.map(({ id, title, icon }) => (
                                   <NavButton
                                        key={id}
                                        type="button"
                                        $active={id === activeId}
                                        aria-current={id === activeId ? "page" : undefined}
                                        onClick={() => select(id)}
                                   >
                                        <Icon name={icon} />
                                        {title}
                                   </NavButton>
                              ))}
                         </NavGroup>
                    ))}
               </nav>

               <UserBox>
                    <div>
                         <strong>{user?.full_name ?? "Foydalanuvchi"}</strong>
                         <span>{isCustomer && user?.code ? `Kod ${user.code}` : ROLE_LABEL[role]}</span>
                    </div>
                    <Logout type="button" aria-label="Chiqish" title="Chiqish" onClick={() => onLogout?.()}>
                         <Icon name="logout" />
                    </Logout>
               </UserBox>
          </Sidebar>

          {/* Mijozda telefonda menyu pastki panelda: bosh barmoq yetadigan joyda */}
          {isCustomer && <Tabbar aria-label="Asosiy menyu">
               {menu.map(({ id, title, icon }) => (
                    <TabButton
                         key={id}
                         type="button"
                         $active={id === activeId}
                         aria-current={id === activeId ? "page" : undefined}
                         onClick={() => select(id)}
                    >
                         <Icon name={icon} />
                         <span>{title}</span>
                    </TabButton>
               ))}
          </Tabbar>}

          <Main>
               <Content $narrow={isCustomer}>
                    {children ?? (isCustomer
                         ? <CustomerOverview user={user} data={data ?? SAMPLE_CUSTOMER} isSample={isSample} />
                         : <StaffOverview
                              isOwner={role === "owner"}
                              data={data ?? SAMPLE_ADMIN}
                              isSample={isSample}
                              onCheckIn={onCheckIn}
                              checkInResult={checkInResult}
                              onAction={onAction}
                         />)}
               </Content>
          </Main>
     </Shell>
}

export default Dashboard