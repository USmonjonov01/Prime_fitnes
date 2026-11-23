import { useEffect, useRef, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {
     ActionButton, Actions, CashHead, CashLegend, CashSummary, CashValue, ChartBox, CodeInput, Columns, Console, ConsoleForm, ConsoleHint,
     ConsoleLabel, ConsoleSubmit, DateText, Dialog, DialogActions, DialogCancel, DialogClose, DialogField, DialogForm, DialogHead,
     DialogInput, DialogPrice, DialogSelect, DialogSubmit, Empty, Figure, Figures, LegendItem,
     List, ListItem, PageHead, PageTitle, Panel, PanelTitle, Pill, Result, SampleNote,
} from "./style"
import { PRICES } from "../../../utils/gym"
import { colors, layout } from "../../../utils/theme"

/* ------------------------------------------------------------------------------------------
   ADMINS / DASHBOARD: xodim (staff) va zal egasi (owner) bosh paneli. Faqat mazmun: karkas va yon menyu
   bu yerda YO'Q (karkas root/index.jsx dagi DashboardLayout da, menyu components/Sidebar da).
   Ma'lumot olish va context ham yo'q, hammasi props orqali keladi.

   Foydalanuvchi props orqali berilmasa, DashboardLayout ning <Outlet context> idan olinadi.

   Props:
     user                   { full_name, role }  role: "staff" | "owner"
     data                   { stats: { visitsToday, activeMembers, expiringSoon, incomeToday },
                              visits: [{ id, name, code, time }], expiring: [{ id, name, plan, note }],
                              cashflow: [{ label, income, expense }] }   cashflow: oylar bo'yicha, so'mda (faqat "owner" ko'radi)
                            Berilmasa NAMUNA ma'lumot va izoh chiqadi
     onCheckIn(code)        kod kiritilib "Belgilash" bosilganda (Enter yoki QR skaner ham)
     checkInResult          { tone: "ok" | "error", message } oxirgi tekshiruv natijasi
     onAction(id, values)   modaldagi forma saqlanganda:
                              "add-customer"  values: { full_name, phone_number }
                              "sell"          values: { code, plan_id, price }
------------------------------------------------------------------------------------------ */

const ICONS = {
     ticket: "M3 8a2 2 0 002-2h14a2 2 0 002 2v3a2 2 0 000 4v3a2 2 0 00-2 2H5a2 2 0 00-2-2v-3a2 2 0 000-4V8zM14 6v12",
     plus: "M12 5v14M5 12h14",
     scan: "M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M7 12h10",
     close: "M6 6l12 12M18 6L6 18",
}

const Icon = ({ name }) => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={ICONS[name]} />
     </svg>
)

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
     // Oylik kirim va chiqim, so'mda. Backend ulangach shu shakldagi ro'yxat data.cashflow bilan keladi.
     cashflow: [
          { label: "Iyun", income: 26400000, expense: 19800000 },
          { label: "Iyul", income: 24900000, expense: 20300000 },
          { label: "Avgust", income: 27800000, expense: 19500000 },
          { label: "Sentabr", income: 31200000, expense: 21100000 },
          { label: "Oktabr", income: 33600000, expense: 21700000 },
          { label: "Noyabr", income: 29500000, expense: 20900000 },
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

const money = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")

// "250 000" -> 250000 (gym.js dagi narxlar matn ko'rinishida)
const toNumber = (text) => Number(String(text).replace(/\D/g, ""))

/* ------------------------------ Modal ------------------------------ */
// Brauzerning o'z <dialog> elementi: ochilganda fokus ichida qoladi, Escape bilan yopiladi.
// Yopilganda (Escape, fon, "Bekor qilish" yoki saqlash) holat onClose orqali tozalanadi.

// Bosilgan elementning o'z modalini yopadi
const closeDialog = (e) => e.currentTarget.closest("dialog").close()

const Modal = ({ title, onClose, children }) => {
     const ref = useRef(null)

     useEffect(() => {
          const dialog = ref.current
          if (!dialog.open) dialog.showModal()
          dialog.querySelector("[data-autofocus]")?.focus()
     }, [])

     return <Dialog
          ref={ref}
          aria-labelledby="dialog-title"
          onClose={onClose}
          onClick={(e) => e.target === e.currentTarget && ref.current.close()} // fonni bosish: yopish
     >
          <DialogHead>
               <h2 id="dialog-title">{title}</h2>
               <DialogClose type="button" aria-label="Yopish" onClick={closeDialog}>
                    <Icon name="close" />
               </DialogClose>
          </DialogHead>
          {children}
     </Dialog>
}

// Formadagi maydonlarni { name: qiymat } ko'rinishida oladi
const readForm = (e) => {
     e.preventDefault()
     return Object.fromEntries(new FormData(e.currentTarget))
}

const AddCustomerModal = ({ onClose, onSave }) => (
     <Modal title="Mijoz qo'shish" onClose={onClose}>
          <DialogForm onSubmit={(e) => {
               // TODO: backendga yuborish (POST /register) shu yerda. Hozircha faqat onSave ga uzatiladi.
               onSave(readForm(e))
               closeDialog(e)
          }}>
               <DialogField>
                    <label htmlFor="new-full-name">Ism va familiya</label>
                    <DialogInput id="new-full-name" name="full_name" type="text" autoComplete="off" data-autofocus required />
               </DialogField>
               <DialogField>
                    <label htmlFor="new-phone">Telefon raqami</label>
                    <DialogInput id="new-phone" name="phone_number" type="tel" inputMode="tel" autoComplete="off" placeholder="+998 90 123 45 67" required />
                    <small>Mijoz shu raqam bilan tizimga kiradi.</small>
               </DialogField>
               <DialogActions>
                    <DialogCancel type="button" onClick={closeDialog}>Bekor qilish</DialogCancel>
                    <DialogSubmit type="submit">Mijozni saqlash</DialogSubmit>
               </DialogActions>
          </DialogForm>
     </Modal>
)

const SellModal = ({ onClose, onSave }) => {
     const [planId, setPlanId] = useState((PRICES.find((p) => p.featured) ?? PRICES[0]).id)
     const plan = PRICES.find((p) => p.id === planId)
     const price = toNumber(plan.price)

     return <Modal title="Abonement sotish" onClose={onClose}>
          <DialogForm onSubmit={(e) => {
               // TODO: backendga yuborish (abonement yaratish va tushumga yozish) shu yerda.
               onSave({ ...readForm(e), price })
               closeDialog(e)
          }}>
               <DialogField>
                    <label htmlFor="sell-code">Mijoz kodi</label>
                    <DialogInput id="sell-code" name="code" type="text" autoComplete="off" data-autofocus required />
               </DialogField>
               <DialogField>
                    <label htmlFor="sell-plan">Abonement turi</label>
                    <DialogSelect id="sell-plan" name="plan_id" value={planId} onChange={(e) => setPlanId(e.target.value)}>
                         {PRICES.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                    </DialogSelect>
               </DialogField>
               <DialogPrice aria-live="polite">
                    <span>Narxi</span>
                    <strong>{money(price)} so'm</strong>
               </DialogPrice>
               <DialogActions>
                    <DialogCancel type="button" onClick={closeDialog}>Bekor qilish</DialogCancel>
                    <DialogSubmit type="submit">Abonementni sotish</DialogSubmit>
               </DialogActions>
          </DialogForm>
     </Modal>
}

/* ------------------------------ Kirim va chiqim (faqat ega) ------------------------------ */

const CashflowPanel = ({ cashflow }) => {
     const income = cashflow.reduce((sum, m) => sum + m.income, 0)
     const expense = cashflow.reduce((sum, m) => sum + m.expense, 0)
     const balance = income - expense
     const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

     return <Panel aria-labelledby="cashflow-title">
          <PanelTitle id="cashflow-title">Kirim va chiqim</PanelTitle>

          {cashflow.length ? <>
               <CashHead>
                    <CashSummary aria-label={`Oxirgi ${cashflow.length} oy bo'yicha jami`}>
                         <div><dt>Kirim</dt><dd>{money(income)}</dd></div>
                         <div><dt>Chiqim</dt><dd>{money(expense)}</dd></div>
                         <div>
                              <dt>Farq</dt>
                              <CashValue $tone={balance >= 0 ? colors.ok : colors.danger}>
                                   {balance > 0 ? "+" : ""}{money(balance)}
                              </CashValue>
                         </div>
                    </CashSummary>

                    <CashLegend aria-hidden="true">
                         <LegendItem $color={colors.ok}>Kirim</LegendItem>
                         <LegendItem $color={colors.danger} $dashed>Chiqim</LegendItem>
                    </CashLegend>
               </CashHead>

               <ChartBox role="img" aria-label={`Oxirgi ${cashflow.length} oylik kirim va chiqim diagrammasi`}>
                    <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={cashflow} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                              <CartesianGrid stroke={colors.line} vertical={false} />
                              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: colors.line }} tickMargin={8} />
                              <YAxis
                                   width={58}
                                   tickLine={false}
                                   axisLine={false}
                                   tickFormatter={(v) => `${Math.round(v / 1000000)} mln`}
                              />
                              <Tooltip
                                   cursor={{ stroke: colors.line }}
                                   formatter={(value, name) => [`${money(value)} so'm`, name]}
                                   contentStyle={{ background: colors.deep, border: `1px solid ${colors.line}`, borderRadius: layout.radius, color: colors.floor }}
                                   labelStyle={{ color: colors.steel, fontWeight: 600 }}
                              />
                              <Line
                                   type="monotone"
                                   dataKey="income"
                                   name="Kirim"
                                   stroke={colors.ok}
                                   strokeWidth={3}
                                   dot={{ r: 3, fill: colors.ok, strokeWidth: 0 }}
                                   activeDot={{ r: 6 }}
                                   isAnimationActive={!reduceMotion}
                              />
                              <Line
                                   type="monotone"
                                   dataKey="expense"
                                   name="Chiqim"
                                   stroke={colors.danger}
                                   strokeWidth={3}
                                   strokeDasharray="7 5"
                                   dot={{ r: 3, fill: colors.danger, strokeWidth: 0 }}
                                   activeDot={{ r: 6 }}
                                   isAnimationActive={!reduceMotion}
                              />
                         </LineChart>
                    </ResponsiveContainer>
               </ChartBox>
          </> : <Empty as="p">Kirim va chiqim ma'lumoti hozircha yo'q.</Empty>}
     </Panel>
}

/* ------------------------------ Bosh panel ------------------------------ */

const AdminOverview = ({ isOwner, data, isSample, onCheckIn, checkInResult, onAction }) => {
     const codeRef = useRef(null)
     const [modal, setModal] = useState(null) // null | "add-customer" | "sell"
     const { stats, visits, expiring, cashflow = [] } = data

     const submitCode = (e) => {
          e.preventDefault()
          const code = codeRef.current.value.trim()
          if (!code) return codeRef.current.focus()
          onCheckIn?.(code)
          codeRef.current.value = ""
          codeRef.current.focus() // keyingi mijoz uchun tayyor (QR skaner ketma-ket o'qiydi)
     }

     const closeModal = () => setModal(null)

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

          {isOwner && <CashflowPanel cashflow={cashflow} />}

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
               <ActionButton type="button" onClick={() => setModal("add-customer")}>
                    <Icon name="plus" /> Mijoz qo'shish
               </ActionButton>
               <ActionButton type="button" onClick={() => setModal("sell")}>
                    <Icon name="ticket" /> Abonement sotish
               </ActionButton>
          </Actions>

          {modal === "add-customer" && <AddCustomerModal onClose={closeModal} onSave={(values) => onAction?.("add-customer", values)} />}
          {modal === "sell" && <SellModal onClose={closeModal} onSave={(values) => onAction?.("sell", values)} />}
     </>
}

/* ------------------------------ Dashboard ------------------------------ */

const Dashboard = ({ user: userProp, data, onCheckIn, checkInResult, onAction }) => {
     const outlet = useOutletContext()
     const user = userProp ?? outlet?.user

     return <AdminOverview
          isOwner={user?.role === "owner"}
          data={data ?? SAMPLE_ADMIN}
          isSample={!data}
          onCheckIn={onCheckIn}
          checkInResult={checkInResult}
          onAction={onAction}
     />
}

export default Dashboard
