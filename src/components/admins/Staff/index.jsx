import { useCallback, useEffect, useRef, useState } from "react"
import { useOutletContext } from "react-router-dom"
import {
     ActionButton, ConfirmText, DangerButton, DetailBody, DetailList, Dialog, DialogActions, DialogCancel, DialogClose,
     DialogField, DialogForm, DialogHead, DialogInput, DialogSubmit, Empty, Figure, Figures, PageHead, PageTitle, Panel,
     PanelTitle, RowButton, RowMain, RowPlan, RowStatus, Rows, Status,
} from "./style"
import { NotificationData } from "../../../context/notifications"
import api from "../../../axios"

/* ------------------------------------------------------------------------------------------
   XODIMLAR (faqat ega): yangi xodim qo'shish, parolini tiklash, bloklash va faollashtirish.
   Xodim kassa va mijozlar bilan ishlaydi, lekin hisobot, chiqim va xodimlar bo'limini ko'rmaydi.

     GET   /staff                      xodimlar ro'yxati
     POST  /staff                      yangi xodim. Vaqtinchalik parol faqat shu javobda keladi (serverda hashi saqlanadi)
     PATCH /staff/:id/status           { status: "active" | "blocked" }
     POST  /staff/:id/reset-password   yangi vaqtinchalik parol
   Xodim telefon raqami va parol bilan kiradi, birinchi kirishda o'zi yangi parol qo'yadi.
------------------------------------------------------------------------------------------ */

const ICONS = {
     plus: "M12 5v14M5 12h14",
     close: "M6 6l12 12M18 6L6 18",
}

const Icon = ({ name }) => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={ICONS[name]} />
     </svg>
)

const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]

const formatDate = (value) => {
     const date = new Date(value)
     if (!value || Number.isNaN(date.getTime())) return null
     return `${date.getDate()}-${MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}

const STATUS = { active: { label: "Faol", tone: "ok" }, blocked: { label: "Bloklangan", tone: "danger" } }
const statusOf = (member) => STATUS[member.status] ?? { label: "Nofaol", tone: "neutral" }

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

const AddStaffModal = ({ onClose, onSave }) => (
     <Modal title="Xodim qo'shish" onClose={onClose}>
          <DialogForm onSubmit={(e) => {
               e.preventDefault()
               onSave(Object.fromEntries(new FormData(e.currentTarget)))
               closeDialog(e)
          }}>
               <DialogField>
                    <label htmlFor="staff-name">Ism va familiya</label>
                    <DialogInput id="staff-name" name="full_name" type="text" autoComplete="off" minLength={2} data-autofocus required />
               </DialogField>
               <DialogField>
                    <label htmlFor="staff-phone">Telefon raqami</label>
                    <DialogInput id="staff-phone" name="phone_number" type="tel" inputMode="tel" autoComplete="off" placeholder="+998 90 123 45 67" required />
                    <small>Xodim shu raqam bilan tizimga kiradi.</small>
               </DialogField>
               <DialogActions>
                    <DialogCancel type="button" onClick={closeDialog}>Bekor qilish</DialogCancel>
                    <DialogSubmit type="submit">Xodimni saqlash</DialogSubmit>
               </DialogActions>
          </DialogForm>
     </Modal>
)

// Vaqtinchalik parol faqat yaratilgan yoki tiklangan paytda ko'rinadi
const CredentialsModal = ({ info, onClose }) => (
     <Modal title="Kirish ma'lumotlari" onClose={onClose}>
          <DetailBody>
               <ConfirmText>{info.name} uchun. Parol faqat hozir ko'rinadi: uni xodimga yozib bering. Birinchi kirishda xodim o'z parolini qo'yadi.</ConfirmText>
               <DetailList>
                    <div><dt>Login (telefon raqami)</dt><dd>{info.login}</dd></div>
                    <div><dt>Vaqtinchalik parol</dt><dd>{info.password}</dd></div>
               </DetailList>
               <DialogActions>
                    <DialogSubmit type="button" data-autofocus onClick={closeDialog}>Tushundim</DialogSubmit>
               </DialogActions>
          </DetailBody>
     </Modal>
)

const DetailModal = ({ member, onClose, onChangeStatus, onResetPassword }) => {
     const [confirming, setConfirming] = useState(false)
     const status = statusOf(member)
     const isActive = member.status === "active"

     return <Modal title={member.full_name} onClose={onClose}>
          <DetailBody>
               <DetailList>
                    <div><dt>Telefon</dt><dd>{member.phone_number}</dd></div>
                    <div><dt>Qo'shilgan</dt><dd>{formatDate(member.created_at) ?? "Noma'lum"}</dd></div>
                    <div><dt>Holat</dt><dd><Status $tone={status.tone}>{status.label}</Status></dd></div>
               </DetailList>

               {confirming && <ConfirmText>Xodim bloklansa tizimga kira olmaydi va ochiq sessiyasi darhol to'xtaydi. Davom etamizmi?</ConfirmText>}

               <DialogActions>
                    {confirming
                         ? <>
                              <DialogCancel type="button" onClick={() => setConfirming(false)}>Yo'q, qaytish</DialogCancel>
                              <DangerButton type="button" onClick={(e) => { onChangeStatus(member, "blocked"); closeDialog(e) }}>Ha, bloklash</DangerButton>
                         </>
                         : <>
                              <DialogCancel type="button" onClick={closeDialog}>Yopish</DialogCancel>
                              <DialogCancel type="button" onClick={() => onResetPassword(member)}>Parolni tiklash</DialogCancel>
                              {isActive
                                   ? <DangerButton type="button" onClick={() => setConfirming(true)}>Bloklash</DangerButton>
                                   : <DialogSubmit type="button" onClick={(e) => { onChangeStatus(member, "active"); closeDialog(e) }}>Faollashtirish</DialogSubmit>}
                         </>}
               </DialogActions>
          </DetailBody>
     </Modal>
}

/* ------------------------------ Sahifa ------------------------------ */

const OwnerStaff = () => {
     const [, notify] = NotificationData()
     const [list, setList] = useState(null)
     const [failed, setFailed] = useState(false)
     const [adding, setAdding] = useState(false)
     const [selectedId, setSelectedId] = useState(null)
     const [credentials, setCredentials] = useState(null) // { name, login, password } yoki null

     const reload = useCallback(async () => {
          const entity = "Xodimlar"
          notify({ type: "GET_pending", payload: { entity } })
          try {
               setList((await api.get("/staff")).data)
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

     const handleAdd = async ({ full_name, phone_number }) => {
          const entity = "Xodim"
          notify({ type: "POST_pending", payload: { entity } })
          try {
               const { data } = await api.post("/staff", { full_name: full_name.trim(), phone_number: phone_number.trim() })
               const { temporary_password: password, ...created } = data
               setList((prev) => [created, ...(prev ?? [])])
               setCredentials({ name: created.full_name, login: created.phone_number, password })
               notify({ type: "POST_success", payload: { entity } })
          } catch (error) {
               notify({ type: "POST_error", payload: { entity, error } })
          }
     }

     const handleStatus = async (member, to) => {
          const entity = "Xodim holati"
          notify({ type: "PUT_pending", payload: { entity } })
          try {
               await api.patch(`/staff/${member.id}/status`, { status: to })
               setList((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: to } : m)))
               notify({ type: "PUT_success", payload: { entity } })
          } catch (error) {
               notify({ type: "PUT_error", payload: { entity, error } })
          }
     }

     const handleReset = async (member) => {
          const entity = "Parol"
          notify({ type: "PUT_pending", payload: { entity } })
          try {
               const { data } = await api.post(`/staff/${member.id}/reset-password`)
               notify({ type: "PUT_success", payload: { entity } })
               setCredentials({ name: member.full_name, login: member.phone_number, password: data.temporary_password })
          } catch (error) {
               notify({ type: "PUT_error", payload: { entity, error } })
          }
     }

     if (!list) {
          return failed
               ? <Empty>
                    <h2>Xodimlarni yuklab bo'lmadi</h2>
                    <p>Internetni tekshirib, qayta urinib ko'ring.</p>
                    <ActionButton type="button" onClick={reload}>Qayta yuklash</ActionButton>
               </Empty>
               : <Empty as="p">Xodimlar yuklanmoqda...</Empty>
     }

     const selected = selectedId == null ? null : list.find((m) => m.id === selectedId)
     const activeCount = list.filter((m) => m.status === "active").length

     return <>
          <PageHead>
               <PageTitle>Xodimlar</PageTitle>
               <ActionButton type="button" onClick={() => setAdding(true)}>
                    <Icon name="plus" /> Xodim qo'shish
               </ActionButton>
          </PageHead>

          <Figures aria-label="Xodimlar ko'rsatkichlari">
               <Figure><strong>{list.length}</strong><span>Jami xodimlar</span></Figure>
               <Figure><strong>{activeCount}</strong><span>Faol</span></Figure>
          </Figures>

          <Panel aria-labelledby="staff-title">
               <PanelTitle id="staff-title">Xodimlar ro'yxati</PanelTitle>

               {!list.length && <Empty as="p">Hozircha xodim yo'q. «Xodim qo'shish» tugmasi bilan birinchisini qo'shing.</Empty>}

               <Rows>
                    {list.map((member) => {
                         const status = statusOf(member)
                         return <li key={member.id}>
                              <RowButton type="button" onClick={() => setSelectedId(member.id)}>
                                   <RowMain>
                                        <strong>{member.full_name}</strong>
                                        <small>{member.phone_number}</small>
                                   </RowMain>
                                   <RowPlan><span>Qo'shilgan: {formatDate(member.created_at) ?? "noma'lum"}</span></RowPlan>
                                   <RowStatus><Status $tone={status.tone}>{status.label}</Status></RowStatus>
                              </RowButton>
                         </li>
                    })}
               </Rows>
          </Panel>

          {adding && <AddStaffModal onClose={() => setAdding(false)} onSave={handleAdd} />}
          {selected && <DetailModal key={selected.id} member={selected} onClose={() => setSelectedId(null)} onChangeStatus={handleStatus} onResetPassword={handleReset} />}
          {credentials && <CredentialsModal info={credentials} onClose={() => setCredentials(null)} />}
     </>
}

// Faqat ega uchun. Menyuda xodimga ko'rinmaydi, manzilni qo'lda yozsa shu yerda to'xtaydi
// (haqiqiy himoya serverda: /staff faqat ega tokeni bilan ishlaydi).
const Staff = () => {
     const outlet = useOutletContext()
     if (outlet?.user?.role !== "owner") {
          return <Empty>
               <h2>Bu bo'lim faqat ega uchun</h2>
               <p>Xodimlarni boshqarish uchun ega sifatida kiring.</p>
          </Empty>
     }
     return <OwnerStaff />
}

export default Staff
