import { useCallback, useEffect, useRef, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {
     ActionButton, Actions, CashHead, CashLegend, CashSummary, CashValue, ChartBox, CodeInput, Columns, Console, ConsoleForm, ConsoleHint,
     ConsoleLabel, ConsoleSubmit, ScanToggle, DateText, Dialog, DialogActions, DialogCancel, DialogClose, DialogField, DialogForm, DialogHead,
     DialogInput, DialogPrice, DialogSelect, DialogSubmit, Empty, Figure, Figures, LegendItem,
     List, ListItem, PageHead, PageTitle, Panel, PanelTitle, Pill, Result,
} from "./style"
import { PRICES } from "../../../utils/gym"
import { colors, layout } from "../../../utils/theme"
import { NotificationData } from "../../../context/notifications"
import { MessageData } from "../../../context/messages"
import { message } from "../../../context/messages/reducer"
import { AdminData } from "../../../context/admins"
import api from "../../../axios"
import ActivityFeed from "../../ActivityFeed"
import PhoneVerify from "../../PhoneVerify"
import QrScanner from "../../QrScanner"

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

/* ------------------------------ Yordamchilar ------------------------------ */

// Brauzerlarda o'zbek tili ma'lumoti bo'lmasligi mumkin, shuning uchun oy va hafta kunlari qo'lda yozilgan
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]
const WEEKDAYS = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"]

const today = () => {
     const now = new Date()
     return `${now.getDate()}-${MONTHS[now.getMonth()]}, ${WEEKDAYS[now.getDay()]}`
}

// Eksa belgisi: 2 000 000 -> "2 mln", 1 500 000 -> "1,5 mln", 250 000 -> "250 ming" (butun mlnga yumaloqlansa belgilar takrorlanib qolardi)
const shortMoney = (value) => {
     if (value >= 1000000) return `${String(Number((value / 1000000).toFixed(1))).replace(".", ",")} mln`
     if (value >= 1000) return `${Math.round(value / 1000)} ming`
     return String(value)
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

// Vaqtinchalik parol faqat mijoz yaratilganda ko'rsatiladi (serverda faqat hashi saqlanadi)
const CredentialsModal = ({ info, onClose }) => (
     <Modal title="Kirish ma'lumotlari" onClose={onClose}>
          <DialogForm onSubmit={(e) => { e.preventDefault(); closeDialog(e) }}>
               <DialogPrice><span>{info.name}, kod</span><strong>{info.code}</strong></DialogPrice>
               <DialogPrice><span>Vaqtinchalik parol</span><strong>{info.password}</strong></DialogPrice>
               <small>Parol faqat hozir ko'rinadi: uni mijozga yozib bering. Birinchi kirishda mijoz o'z parolini qo'yadi.</small>
               {info.customer && <PhoneVerify customer={info.customer} />}
               <DialogActions>
                    <DialogSubmit type="submit" data-autofocus>Tushundim</DialogSubmit>
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
                                   tickFormatter={shortMoney}
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

const AdminOverview = ({ isOwner, data, onCheckIn, checkInResult, checking, onAction }) => {
     const codeRef = useRef(null)
     const [modal, setModal] = useState(null) // null | "add-customer" | "sell"
     const [scanning, setScanning] = useState(false) // kamera orqali QR skanerlash yoqilgan
     const { stats, visits, expiring, cashflow = [] } = data

     const submitCode = (e) => {
          e.preventDefault()
          const code = codeRef.current.value.trim()
          if (!code) return codeRef.current.focus()
          if (checking) return // oldingi mijoz tekshirilmoqda: ketma-ket skanerlashda navbat aralashmasin
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
                    <ConsoleSubmit type="submit" disabled={checking}>
                         <Icon name="scan" />
                         {checking ? "Tekshirilmoqda..." : "Belgilash"}
                    </ConsoleSubmit>
               </ConsoleForm>
               <ScanToggle type="button" aria-pressed={scanning} onClick={() => setScanning((on) => !on)}>
                    <Icon name="scan" />
                    {scanning ? "Kamerani o'chirish" : "Kamera bilan skanerlash"}
               </ScanToggle>
               {scanning && <QrScanner paused={checking} onScan={(text) => onCheckIn?.({ qr: text })} />}
               <ConsoleHint>Mijozning telefonidagi QR kodni kamera bilan o'qiting. USB skaner ham ishlaydi, zaxira yo'l: kodni yozib Enter bosing.</ConsoleHint>
               {checking
                    ? <Result role="status" $tone="wait">Tekshirilmoqda... Server uyg'onayotgan bo'lsa bir necha soniya ketadi.</Result>
                    : checkInResult && <Result role="status" $tone={checkInResult.tone}>{checkInResult.message}</Result>}
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
                    {!visits.length && <Empty as="p">Hozircha tashrif yo'q.</Empty>}
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
                    {!expiring.length && <Empty as="p">Tez tugaydigan abonement yo'q.</Empty>}
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

/* ------------------------------ Ma'lumot olish (backend) ------------------------------ */
//   GET  /dashboard/admin     { stats, visits, expiring, cashflow }: hammasi serverda hisoblanadi.
//                             Kirim/chiqim va bugungi tushum faqat ega uchun keladi.
//   POST /customers           yangi mijoz (kod va vaqtinchalik parol serverda)
//   POST /subscriptions       abonement sotish. Narx va qoidalar serverdagi abonement turidan olinadi, brauzer narx yubormaydi.
//   POST /visits/check-in     kirishni belgilash. Rad etilsa error.details.reason: not_found | blocked | expired | finished | already_today

const loadDashboard = async () => (await api.get("/dashboard/admin")).data

const addCustomer = async ({ full_name, phone_number }) => {
     const { data } = await api.post("/customers", { full_name: full_name.trim(), phone_number: phone_number.trim() })
     return { client: { id: data.id, full_name: data.full_name, code: data.code }, temporaryPassword: data.temporary_password }
}

const sellAbonement = async ({ code, plan_id }) => {
     const { data } = await api.post("/subscriptions", { code: code.trim(), plan_id })
     return data // { id, client, visitTotal, endDate }
}

// payload: { code } (qo'lda yozilgan kod) yoki { qr } (QR kod matni)
const checkInCustomer = async (payload) => {
     try {
          return (await api.post("/visits/check-in", payload)).data // { client, visitsLeft, method }
     } catch (error) {
          const denied = error.response?.data?.error
          if (denied?.code === "CHECKIN_DENIED") {
               throw Object.assign(new Error(denied.details?.reason), { reason: denied.details?.reason, client: denied.details?.client })
          }
          throw error
     }
}

// Biznes rad etishining foydalanuvchiga ko'rinadigan matni (kirishni belgilash oynasida)
const DENIED_TEXT = {
     not_found: "Bu kod bo'yicha mijoz topilmadi. Kodni tekshiring.",
     expired: "Abonement muddati tugagan.",
     finished: "Abonement tashriflari tugagan.",
     blocked: "Mijoz bloklangan.",
     already_today: "Bugun allaqachon belgilangan.",
     qr_expired: "QR kod muddati tugagan. Mijozdan telefonidagi kodni yangilab (sahifani qayta ochib), qayta ko'rsatishni so'rang.",
     qr_invalid: "QR kod noto'g'ri yoki Prime Fit kodi emas.",
}

const Dashboard = ({ user: userProp, data, onCheckIn, checkInResult, onAction }) => {
     const outlet = useOutletContext()
     const [, notify] = NotificationData()
     const [, send] = MessageData()
     const [, adminDispatch] = AdminData()
     const user = userProp ?? outlet?.user
     const isOwner = user?.role === "owner"
     const shown = data ?? outlet?.data // props bo'lmasa context/admins dagi ma'lumot
     const [failed, setFailed] = useState(false)
     const [credentials, setCredentials] = useState(null) // yangi mijozning kodi va vaqtinchalik paroli
     const [checking, setChecking] = useState(false) // kirish belgilanmoqda (javob kutilmoqda)
     const [tick, setTick] = useState(0) // voqealar lentasini darhol yangilash uchun

     // Ma'lumot serverdan olinadi va context/admins ga yoziladi. silent: bildirishnomasiz yangilash
     // (saqlash natijasi bildirishnomasi ustidan yozilib qolmasligi uchun amallardan keyin shunday)
     const reload = useCallback(async (silent = false) => {
          const entity = "Ma'lumotlar"
          if (!silent) notify({ type: "GET_pending", payload: { entity } })
          try {
               adminDispatch({ type: "SET_DATA", payload: await loadDashboard() })
               setFailed(false)
               if (!silent) notify({ type: "GET_success", payload: { entity } })
          } catch (error) {
               if (silent) return // eski ma'lumot turaveradi
               setFailed(true)
               notify({ type: "GET_error", payload: { entity, error } })
          }
     }, [notify, adminDispatch])

     // Sahifa ochilganda: ma'lumot bo'lmasa yuklaymiz, bo'lsa orqada yangilaymiz. props orqali data berilsa so'rov yuborilmaydi.
     useEffect(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- serverdan ma'lumot olish: sahifa ochilganda bir marta
          if (!data) reload(Boolean(outlet?.data))
     }, [])   // eslint-disable-line react-hooks/exhaustive-deps

     // Natija 10 soniyadan keyin o'zi yo'qoladi (keyingi mijozga o'tganda eski natija chalg'itmasin)
     const shownResult = checkInResult ?? outlet?.checkInResult
     useEffect(() => {
          if (!shownResult) return
          const timer = setTimeout(() => adminDispatch({ type: "CLEAR_CHECK_IN" }), 10000)
          return () => clearTimeout(timer)
     }, [shownResult, adminDispatch])

     // Modal formalari: so'rov (onAction) sizniki, bu yerda faqat natija ko'rsatiladi va xabar yuboriladi
     const runAction = async (id, values) => {
          const sell = id === "sell"
          const entity = sell ? "Abonement" : "Mijoz"

          notify({ type: "POST_pending", payload: { entity } })
          try {
               const result = await (onAction ?? (id === "sell" ? sellAbonement : addCustomer))(...(onAction ? [id, values] : [values]))
               notify({ type: "POST_success", payload: { entity } })
               reload(true)
               setTick((n) => n + 1)

               if (sell) {
                    send(message("SUBSCRIPTION_SOLD", {
                         client: result?.client ?? { code: values.code },
                         plan: PRICES.find((p) => p.id === values.plan_id)?.name,
                         price: values.price,
                         visitTotal: result?.visitTotal,
                         endDate: result?.endDate,
                    }))
               } else {
                    if (result?.temporaryPassword) setCredentials({ name: result.client.full_name, code: result.client.code, password: result.temporaryPassword, customer: result.client.id ? { id: result.client.id, phone_number: values.phone_number } : null })
                    send(message("CUSTOMER_ADDED", { client: result?.client ?? { full_name: values.full_name } }))
               }
          } catch (error) {
               notify({ type: "POST_error", payload: { entity, error } })
          }
     }

     // Kirish matnidan so'rov tanasi: QR (yoki USB skaner yozgan "PF1." matni) -> qr, boshqasi -> qo'lda yozilgan kod
     const runCheckIn = async (input) => {
          const payload = typeof input === "string"
               ? (input.trim().startsWith("PF1.") ? { qr: input.trim().slice(0, 200) } : { code: input.trim() })
               : { qr: String(input.qr).slice(0, 200) }
          setChecking(true)
          try {
               const result = await (onCheckIn ?? checkInCustomer)(payload)
               const left = Number.isFinite(result?.visitsLeft) ? `. Qolgan tashriflar: ${result.visitsLeft}` : ""
               adminDispatch({ type: "SET_CHECK_IN_RESULT", payload: { tone: "ok", message: `${result?.client?.full_name ?? "Mijoz"} belgilandi${left}` } })
               notify({ type: "POST_success", payload: { entity: "Kirish" } })
               send(message("CHECK_IN", { client: result?.client, method: result?.method, visitsLeft: result?.visitsLeft }))
               reload(true)
          } catch (error) {
               if (error?.reason) { // zal qoidasi bo'yicha rad etildi: xato emas, aniq sabab bor
                    adminDispatch({ type: "SET_CHECK_IN_RESULT", payload: { tone: "error", message: DENIED_TEXT[error.reason] ?? "Kirishga ruxsat berilmadi." } })
                    send(message("CHECK_IN_DENIED", { client: error.client, code: payload.code, reason: error.reason }))
               } else {
                    notify({ type: "POST_error", payload: { entity: "Kirish", error } })
               }
          } finally {
               setChecking(false)
               setTick((n) => n + 1)
          }
     }

     if (!shown) {
          return failed
               ? <Empty>
                    <h2>Ma'lumotlarni yuklab bo'lmadi</h2>
                    <p>Internetni tekshirib, qayta urinib ko'ring.</p>
                    <ActionButton type="button" onClick={() => reload()}>Qayta yuklash</ActionButton>
               </Empty>
               : <Empty as="p">Ma'lumotlar yuklanmoqda...</Empty>
     }

     return <>
          <AdminOverview
               isOwner={isOwner}
               data={shown}
               onCheckIn={runCheckIn}
               checkInResult={shownResult}
               checking={checking}
               onAction={runAction}
          />
          <ActivityFeed url="/activity" audience="admin" title="So'nggi voqealar" showActor refreshKey={tick} />
          {credentials && <CredentialsModal info={credentials} onClose={() => setCredentials(null)} />}
     </>
}

export default Dashboard