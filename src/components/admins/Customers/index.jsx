import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useOutletContext } from "react-router-dom"
import {
     ActionButton, ConfirmText, Count, DangerButton, DetailBody, DetailList, Dialog, DialogActions, DialogCancel, DialogClose,
     DialogField, DialogForm, DialogHead, DialogInput, DialogSubmit, Empty, Figure, Figures, FilterButton, Filters, Hidden,
     LoadMore, Muted, PageHead, PageTitle, Panel, PanelTitle, RowButton, RowMain, RowPlan, RowStatus, Rows, SearchField,
     SearchInput, Sheet, SheetItem, Status, SubTitle, Toolbar,
} from "./style"
import { PRICES } from "../../../utils/gym"
import { NotificationData } from "../../../context/notifications"
import { MessageData } from "../../../context/messages"
import { message } from "../../../context/messages/reducer"
import api from "../../../axios"

const ICONS = {
     plus: "M12 5v14M5 12h14",
     close: "M6 6l12 12M18 6L6 18",
}

const Icon = ({ name }) => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={ICONS[name]} />
     </svg>
)

/* ------------------------------ Yordamchilar ------------------------------ */
// Dashboard dagi yordamchilarning nusxasi (umumiy util fayli yo'q, shuning uchun har komponentda o'zi bor).
// Abonement holati saqlanmaydi, har safar hisoblanadi.

const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]
const DAY_MS = 24 * 60 * 60 * 1000
const PAGE = 30 // ro'yxatda bir vaqtda ko'rinadigan mijozlar soni

const digitsOf = (value) => String(value ?? "").replace(/\D/g, "")
const money = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
const pad = (n) => String(n).padStart(2, "0")
const timeOf = (iso) => `${pad(new Date(iso).getHours())}:${pad(new Date(iso).getMinutes())}`
const planName = (id) => PRICES.find((p) => p.id === id)?.name ?? "Abonement"

// "2026-12-30" -> "30-dekabr, 2026". Sana noto'g'ri bo'lsa null
const formatDate = (value) => {
     const date = new Date(value)
     if (!value || Number.isNaN(date.getTime())) return null
     return `${date.getDate()}-${MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}

const stateOf = (a, now = new Date()) => {
     if (a.status === "cancelled") return "cancelled"
     if (Number(a.visit_used) >= Number(a.visit_total)) return "finished"
     if (now > new Date(a.end_date)) return "expired"
     return "active"
}

const daysLeftOf = (a, now = new Date()) => Math.max(0, Math.ceil((new Date(a.end_date) - now) / DAY_MS))
const visitsLeftOf = (a) => Math.max(0, Number(a.visit_total) - Number(a.visit_used))
const byDateDesc = (field) => (a, b) => new Date(b[field]) - new Date(a[field])

// "Oxirgi tashrif": bugun, kecha yoki necha kun oldin (kalendar kunlari bo'yicha)
const agoText = (iso, now = new Date()) => {
     if (!iso) return "Hali kelmagan"
     const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
     const days = Math.round((day(now) - day(new Date(iso))) / DAY_MS)
     if (days <= 0) return "Bugun keldi"
     if (days === 1) return "Kecha keldi"
     return `${days} kun oldin keldi`
}

const STATE_LABEL = { active: "Faol", finished: "Tashriflar tugagan", expired: "Muddati tugagan", cancelled: "Bekor qilingan" }
const CUSTOMER_STATUS = { blocked: "Bloklangan", inactive: "Nofaol", frozen: "Muzlatilgan" }

/* ------------------------------ Mijoz qatori ------------------------------ */

// Bitta mijoz bo'yicha hamma narsa yig'iladi. Guruhlar: blocked | expiring | active | ended | none
const summarize = ({ customer, abonements, visits, visitsTotal, lastVisitAt }, now = new Date()) => {
     const active = abonements
          .filter((a) => stateOf(a, now) === "active")
          .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))[0]
     const current = active ?? [...abonements].sort(byDateDesc("created_at"))[0] ?? null

     let group = "none"
     if (customer.status !== "active") group = "blocked"
     else if (active) group = daysLeftOf(active, now) <= 7 ? "expiring" : "active"
     else if (current) group = "ended"

     const status = {
          blocked: { label: CUSTOMER_STATUS[customer.status] ?? String(customer.status ?? "Noma'lum"), tone: "danger" },
          expiring: { label: "Tez tugaydi", tone: "warn" },
          active: { label: "Faol", tone: "ok" },
          ended: { label: current ? STATE_LABEL[stateOf(current, now)] : "", tone: "neutral" },
          none: { label: "Abonement yo'q", tone: "neutral" },
     }[group]

     let plan = "Abonement sotilmagan"
     if (current && active) plan = `${planName(current.plan_id)}: ${daysLeftOf(current, now)} kun, ${visitsLeftOf(current)} tashrif qoldi`
     else if (current) plan = `${planName(current.plan_id)}${formatDate(current.end_date) ? `, ${formatDate(current.end_date)} gacha edi` : ""}`

     return { customer, abonements, visits, visitsTotal, group, status, plan, lastVisit: lastVisitAt }
}

const FILTERS = [
     { id: "all", label: "Hammasi" },
     { id: "active", label: "Faol" },
     { id: "expiring", label: "Tez tugaydi" },
     { id: "ended", label: "Tugagan" },
     { id: "none", label: "Abonementsiz" },
     { id: "blocked", label: "Bloklangan" },
]

// "Faol" tanlovi 7 kunda tugaydiganlarni ham o'z ichiga oladi
const matches = (filter, row) => filter === "all" || row.group === filter || (filter === "active" && row.group === "expiring")

/* ------------------------------ Ma'lumot olish (backend) ------------------------------ */
//   GET   /customers                      mijozlar: abonementlari, tashriflar soni, oxirgi tashriflari (bitta so'rov)
//   POST  /customers                      yangi mijoz: kod va vaqtinchalik parol serverda yaratiladi (parol faqat shu javobda)
//   PATCH /customers/:id/status           bloklash / faollashtirish
//   POST  /customers/:id/reset-password   parolni tiklash (yangi vaqtinchalik parol qaytadi)
// Narx (price) abonementlarda faqat ega uchun keladi: xodimga server yubormaydi.

const loadCustomers = async () => {
     const { data } = await api.get("/customers")
     return data.map((r) => ({
          customer: r.customer,
          abonements: r.abonements,
          visits: r.recent_visits,
          visitsTotal: r.visits_total,
          lastVisitAt: r.last_visit_at,
     }))
}

const addCustomer = async ({ full_name, phone_number }) => {
     const { data } = await api.post("/customers", { full_name: full_name.trim(), phone_number: phone_number.trim() })
     return data // { id, full_name, phone_number, code, status, created_at, temporary_password }
}

/* ------------------------------ Modal ------------------------------ */
// Brauzerning o'z <dialog> elementi: fokus ichida qoladi, Escape bilan yopiladi.

const closeDialog = (e) => e.currentTarget.closest("dialog").close()

const Modal = ({ title, wide, onClose, children }) => {
     const ref = useRef(null)

     useEffect(() => {
          const dialog = ref.current
          if (!dialog.open) dialog.showModal()
          dialog.querySelector("[data-autofocus]")?.focus()
     }, [])

     return <Dialog
          ref={ref}
          $wide={wide}
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

// Vaqtinchalik parol faqat yaratilgan paytda ko'rsatiladi (serverda faqat hashi saqlanadi), shuning uchun adminga shu yerda beriladi
const CredentialsModal = ({ info, onClose }) => (
     <Modal title="Kirish ma'lumotlari" onClose={onClose}>
          <DetailBody>
               <ConfirmText>{info.name} uchun. Parol faqat hozir ko'rinadi: uni mijozga yozib bering. Birinchi kirishda mijoz o'z parolini qo'yadi.</ConfirmText>
               <DetailList>
                    <div><dt>Login (kod yoki telefon)</dt><dd>{info.code}</dd></div>
                    <div><dt>Vaqtinchalik parol</dt><dd>{info.password}</dd></div>
               </DetailList>
               <DialogActions>
                    <DialogSubmit type="button" data-autofocus onClick={closeDialog}>Tushundim</DialogSubmit>
               </DialogActions>
          </DetailBody>
     </Modal>
)

// Mijoz tafsiloti: ma'lumotlari, abonementlari, oxirgi tashriflari va bloklash. Narx faqat egaga ko'rinadi.
const DetailModal = ({ row, isOwner, onClose, onChangeStatus, onResetPassword }) => {
     const [confirming, setConfirming] = useState(false)
     const { customer, abonements, visits, visitsTotal, status, lastVisit } = row
     const isActive = customer.status === "active"

     return <Modal title={customer.full_name} wide onClose={onClose}>
          <DetailBody>
               <DetailList>
                    <div><dt>Kod</dt><dd>{customer.code}</dd></div>
                    <div><dt>Telefon</dt><dd>{customer.phone_number}</dd></div>
                    <div><dt>Qo'shilgan</dt><dd>{formatDate(customer.created_at) ?? "Noma'lum"}</dd></div>
                    <div><dt>Holat</dt><dd><Status $tone={status.tone}>{status.label}</Status></dd></div>
                    <div><dt>Jami tashrif</dt><dd>{visitsTotal}</dd></div>
                    <div><dt>Oxirgi tashrif</dt><dd>{agoText(lastVisit)}</dd></div>
               </DetailList>

               <section aria-labelledby="detail-abonements">
                    <SubTitle id="detail-abonements">Abonementlar</SubTitle>
                    {!abonements.length && <Muted>Hali abonement sotilmagan.</Muted>}
                    <Sheet>
                         {[...abonements].sort(byDateDesc("created_at")).map((a) => (
                              <SheetItem key={a.id}>
                                   <div>
                                        <strong>{planName(a.plan_id)}</strong>
                                        <span>{formatDate(a.start_date) ?? "?"} dan {formatDate(a.end_date) ?? "?"} gacha</span>
                                        <span>Tashrif: {a.visit_used} / {a.visit_total}{isOwner && Number.isFinite(Number(a.price)) ? `, ${money(Number(a.price))} so'm` : ""}</span>
                                   </div>
                                   <Status $tone={stateOf(a) === "active" ? "ok" : "neutral"}>{STATE_LABEL[stateOf(a)]}</Status>
                              </SheetItem>
                         ))}
                    </Sheet>
               </section>

               <section aria-labelledby="detail-visits">
                    <SubTitle id="detail-visits">Oxirgi tashriflar</SubTitle>
                    {!visits.length && <Muted>Tashrif yo'q.</Muted>}
                    <Sheet>
                         {visits.slice(0, 8).map((v) => (
                              <SheetItem key={v.id}>
                                   <strong>{formatDate(v.created_at) ?? "Sana noma'lum"}</strong>
                                   <time>{timeOf(v.created_at)}</time>
                              </SheetItem>
                         ))}
                    </Sheet>
               </section>

               <DialogActions>
                    {confirming
                         ? <>
                              <ConfirmText>Mijoz zalga kira olmaydi. Bloklaysizmi?</ConfirmText>
                              <DialogCancel type="button" onClick={() => setConfirming(false)}>Yo'q</DialogCancel>
                              <DangerButton type="button" onClick={(e) => { onChangeStatus(row, "blocked"); closeDialog(e) }}>Ha, bloklash</DangerButton>
                         </>
                         : <>
                              <DialogCancel type="button" onClick={closeDialog}>Yopish</DialogCancel>
                              <DialogCancel type="button" onClick={() => onResetPassword(row)}>Parolni tiklash</DialogCancel>
                              {isActive
                                   ? <DangerButton type="button" onClick={() => setConfirming(true)}>Bloklash</DangerButton>
                                   : <DialogSubmit type="button" onClick={(e) => { onChangeStatus(row, "active"); closeDialog(e) }}>Faollashtirish</DialogSubmit>}
                         </>}
               </DialogActions>
          </DetailBody>
     </Modal>
}

/* ------------------------------ Mijozlar ------------------------------ */

const Customers = () => {
     const outlet = useOutletContext()
     const [, notify] = NotificationData()
     const [, send] = MessageData()
     const isOwner = outlet?.user?.role === "owner"
     // Bu sahifaning ma'lumoti faqat shu yerda turadi: admins contextidagi `data` Bosh panelniki, ustidan yozilmaydi
     const [raw, setRaw] = useState(null)
     const [failed, setFailed] = useState(false)
     const [query, setQuery] = useState("")
     const [filter, setFilter] = useState("all")
     const [limit, setLimit] = useState(PAGE)
     const [selectedId, setSelectedId] = useState(null)
     const [adding, setAdding] = useState(false)
     const [credentials, setCredentials] = useState(null) // { name, code, password } yoki null

     const reload = useCallback(async () => {
          const entity = "Mijozlar"
          notify({ type: "GET_pending", payload: { entity } })
          try {
               setRaw(await loadCustomers())
               setFailed(false)
               notify({ type: "GET_success", payload: { entity } })
          } catch (error) {
               setFailed(true)
               notify({ type: "GET_error", payload: { entity, error } })
          }
     }, [notify])

     useEffect(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- serverdan ma'lumot olish: sahifa ochilganda bir marta
          reload()
     }, [])   // eslint-disable-line react-hooks/exhaustive-deps

     const rows = useMemo(() => (raw ?? []).map((item) => summarize(item)), [raw])

     const counts = useMemo(
          () => Object.fromEntries(FILTERS.map(({ id }) => [id, rows.filter((r) => matches(id, r)).length])),
          [rows],
     )

     const shown = useMemo(() => {
          const text = query.trim().toLowerCase()
          const digits = digitsOf(text)
          return rows.filter((row) => matches(filter, row) && (
               !text
               || String(row.customer.full_name ?? "").toLowerCase().includes(text)
               || String(row.customer.code ?? "").toLowerCase().includes(text)
               || (digits.length >= 3 && digitsOf(row.customer.phone_number).includes(digits))
          ))
     }, [rows, query, filter])

     const selected = selectedId == null ? null : rows.find((r) => r.customer.id === selectedId)

     const handleAdd = async (values) => {
          const entity = "Mijoz"
          notify({ type: "POST_pending", payload: { entity } })
          try {
               const { temporary_password: password, ...created } = await addCustomer(values)
               setRaw((prev) => [{ customer: created, abonements: [], visits: [], visitsTotal: 0, lastVisitAt: null }, ...(prev ?? [])])
               setCredentials({ name: created.full_name, code: created.code, password })
               setQuery("")
               setFilter("all")
               setLimit(PAGE)
               notify({ type: "POST_success", payload: { entity } })
               send(message("CUSTOMER_ADDED", { client: { id: created.id, full_name: created.full_name, code: created.code } }))
          } catch (error) {
               notify({ type: "POST_error", payload: { entity, error } })
          }
     }

     // Bloklash va faollashtirish. server javob bergach ro'yxat shu yerning o'zida yangilanadi
     const handleStatus = async ({ customer }, to) => {
          const entity = "Mijoz holati"
          const from = customer.status
          notify({ type: "PUT_pending", payload: { entity } })
          try {
               await api.patch(`/customers/${customer.id}/status`, { status: to })
               setRaw((prev) => prev.map((item) => (
                    item.customer.id === customer.id ? { ...item, customer: { ...item.customer, status: to } } : item
               )))
               notify({ type: "PUT_success", payload: { entity } })
               send(message("CUSTOMER_STATUS_CHANGED", { client: { id: customer.id, full_name: customer.full_name, code: customer.code }, from, to }))
          } catch (error) {
               notify({ type: "PUT_error", payload: { entity, error } })
          }
     }

     const handleReset = async ({ customer }) => {
          const entity = "Parol"
          notify({ type: "PUT_pending", payload: { entity } })
          try {
               const { data } = await api.post(`/customers/${customer.id}/reset-password`)
               notify({ type: "PUT_success", payload: { entity } })
               setCredentials({ name: customer.full_name, code: customer.code, password: data.temporary_password })
          } catch (error) {
               notify({ type: "PUT_error", payload: { entity, error } })
          }
     }

     if (!raw) {
          return failed
               ? <Empty>
                    <h2>Mijozlarni yuklab bo'lmadi</h2>
                    <p>Internetni tekshirib, qayta urinib ko'ring.</p>
                    <ActionButton type="button" onClick={reload}>Qayta yuklash</ActionButton>
               </Empty>
               : <Empty as="p">Mijozlar yuklanmoqda...</Empty>
     }

     return <>
          <PageHead>
               <PageTitle>Mijozlar</PageTitle>
               <ActionButton type="button" onClick={() => setAdding(true)}>
                    <Icon name="plus" /> Mijoz qo'shish
               </ActionButton>
          </PageHead>

          <Figures aria-label="Mijozlar ko'rsatkichlari">
               <Figure><strong>{rows.length}</strong><span>Jami mijozlar</span></Figure>
               <Figure><strong>{counts.active}</strong><span>Faol abonementi bor</span></Figure>
               <Figure $warn={counts.expiring > 0}><strong>{counts.expiring}</strong><span>7 kunda tugaydi</span></Figure>
               <Figure><strong>{counts.ended + counts.none}</strong><span>Abonementi yo'q yoki tugagan</span></Figure>
          </Figures>

          <Panel aria-labelledby="customers-title">
               <PanelTitle id="customers-title">Mijozlar ro'yxati</PanelTitle>

               <Toolbar>
                    <SearchField>
                         <Hidden htmlFor="customer-search">Mijozni qidirish</Hidden>
                         <SearchInput
                              id="customer-search"
                              type="search"
                              autoComplete="off"
                              placeholder="Ism, kod yoki telefon bo'yicha qidirish"
                              value={query}
                              onChange={(e) => { setQuery(e.target.value); setLimit(PAGE) }}
                         />
                    </SearchField>

                    <Filters role="group" aria-label="Holat bo'yicha saralash">
                         {FILTERS.map(({ id, label }) => (
                              <FilterButton key={id} type="button" aria-pressed={filter === id} $active={filter === id} onClick={() => { setFilter(id); setLimit(PAGE) }}>
                                   {label} <span>{counts[id]}</span>
                              </FilterButton>
                         ))}
                    </Filters>
               </Toolbar>

               <Count aria-live="polite">{shown.length} ta mijoz</Count>

               {!shown.length && <Empty as="p">
                    {rows.length ? "Bu shartlar bo'yicha mijoz topilmadi." : "Hozircha mijoz yo'q. «Mijoz qo'shish» tugmasi bilan birinchisini qo'shing."}
               </Empty>}

               <Rows>
                    {shown.slice(0, limit).map((row) => (
                         <li key={row.customer.id}>
                              <RowButton type="button" onClick={() => setSelectedId(row.customer.id)}>
                                   <RowMain>
                                        <strong>{row.customer.full_name}</strong>
                                        <small>Kod {row.customer.code} · {row.customer.phone_number}</small>
                                   </RowMain>
                                   <RowPlan>
                                        <span>{row.plan}</span>
                                        <span>{agoText(row.lastVisit)}</span>
                                   </RowPlan>
                                   <RowStatus><Status $tone={row.status.tone}>{row.status.label}</Status></RowStatus>
                              </RowButton>
                         </li>
                    ))}
               </Rows>

               {shown.length > limit && <LoadMore>
                    <ActionButton type="button" onClick={() => setLimit((n) => n + PAGE)}>
                         Yana ko'rsatish ({shown.length - limit})
                    </ActionButton>
               </LoadMore>}
          </Panel>

          {adding && <AddCustomerModal onClose={() => setAdding(false)} onSave={handleAdd} />}
          {selected && <DetailModal key={selected.customer.id} row={selected} isOwner={isOwner} onClose={() => setSelectedId(null)} onChangeStatus={handleStatus} onResetPassword={handleReset} />}
          {credentials && <CredentialsModal info={credentials} onClose={() => setCredentials(null)} />}
     </>
}

export default Customers