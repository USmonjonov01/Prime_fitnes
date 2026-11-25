import { useRef, useState } from "react"
import {
     Cases, Contact, Field, Form, Grid, Info, InfoLead, InfoTitle, Input, Notice, Page, Steps, Submit, Title,
} from "./style"
import { INSTAGRAM, PHONE, PHONE_VIEW } from "../../utils/gym"
import api, { apiMessage, setAccessToken } from "../../axios"
import { useNavigate } from "react-router-dom"
import { homeOf } from "../../utils/sidebar"
import { NotificationData } from "../../context/notifications"
import { AdminData } from "../../context/admins"
import { ClientData } from "../../context/clients"

// Foydalanuvchi o'zi akkaunt ocha olmaydi: hisobni zal administratori ochadi.
// Shu sababli sahifada ro'yxatdan o'tish yo'q, uning o'rniga "Akkaunt yo'qmi?" tushuntirishi turadi.
// Tushuntirish matnlari shu yerdagi ro'yxatlarda, kerak bo'lsa tahrirlash oson.

const STEPS = [
     { title: "Zalga kelib abonement oling", text: "To'lov va abonement zalda administrator bilan rasmiylashtiriladi." },
     { title: "Administrator sizni tizimga qo'shadi", text: "Ism va telefon raqamingiz tizimga kiritiladi." },
     { title: "Kirish ma'lumotlarini oling", text: "Shu sahifada ularni kiritib, hisobingizga kirasiz." },
]

// TODO: javoblar backend va zal qoidalari aniq bo'lgach tekshiriladi.
const CASES = [
     {
          q: "Nega o'zim ro'yxatdan o'ta olmayman?",
          a: "Hisob abonementingiz va zalga kirishlaringizga bog'langan. Uni to'lovni qabul qilgan administrator ochadi, shunda begona odam sizning nomingizdan hisob ocha olmaydi.",
     },
     { q: "Parolni unutdim", a: "Administratorga ayting, u sizga yangi kirish ma'lumotlarini beradi." },
     { q: "Kirish ma'lumotlarim noto'g'ri deb chiqyapti", a: "Administratordan ma'lumotlaringizni tekshirib berishni so'rang. Ism yoki telefon raqami xato kiritilgan bo'lishi mumkin." },
     { q: "Abonementim tugadi", a: "Abonementni zalda administrator orqali yangilang." },
     { q: "Men xodimman yoki zal egasiman", a: "Xodim hisobini zal egasi ochadi. Hisobingiz bo'lmasa egasiga murojaat qiling." },
]

const MIN_PASSWORD = 6 // serverdagi qoida bilan bir xil

const Login = () => {
     // Inputlar useRef bilan o'qiladi (forma maydonlari boshqarilmaydi)
     const loginRef = useRef(null)
     const passwordRef = useRef(null)
     const newPasswordRef = useRef(null)
     const repeatRef = useRef(null)

     // So'rov holatlari (pending, success, error) NotificationData contextida: ekranda antd message bo'lib chiqadi.
     const [notification, dispatch] = NotificationData()
     // Kirgan foydalanuvchi o'z tomonining contextiga yoziladi (admin yoki mijoz)
     const [, adminDispatch] = AdminData()
     const [, clientDispatch] = ClientData()
     const [pending, setPending] = useState(false) // vaqtinchalik parol bilan kirdi: yangi parol kutilmoqda
     const [checking, setChecking] = useState(false) // login va parol tekshirilmoqda (tugmada "Kirilmoqda...")
     const [error, setError] = useState("")
     const navigate = useNavigate()
     const saving = notification?.status === "pending" && notification.method === "PUT" // yangi parol saqlanmoqda

     // Server tasdiqlagan foydalanuvchi: rol serverdan keladi (admin yoki mijoz belgisi endi kerak emas)
     function finish(user) {
          // Brauzerga faqat interfeys uchun kerakli maydonlar yoziladi. Haqiqiy himoya serverda (token orqali).
          const saved = { id: user.id, full_name: user.full_name, phone_number: user.phone_number, role: user.role }
          if (user.code) saved.code = user.code

          localStorage.setItem("userData", JSON.stringify(saved)) // avval saqlaymiz, keyin o'tamiz
          // Context va localStorage bir xil: sahifa yangilansa context bo'shaydi, DashboardLayout uni localStorage dan tiklaydi
          ;(user.role === "customer" ? clientDispatch : adminDispatch)({ type: "LOGIN", payload: { user: saved } })
          ;(user.role === "customer" ? adminDispatch : clientDispatch)({ type: "LOGOUT" }) // boshqa tomonda qolgan eski foydalanuvchi bo'lmasin
          navigate(homeOf(user.role), { replace: true })
     }

     async function handleLogin(e) {
          e.preventDefault()
          if (checking) return
          setError("")
          setChecking(true)

          try {
               const { data } = await api.post("/auth/login", {
                    login: loginRef.current.value.trim(),
                    password: passwordRef.current.value.trim(),
               })
               setAccessToken(data.access_token)
               if (data.user.must_change_password) setPending(true)
               else finish(data.user)
          } catch (err) {
               setError(apiMessage(err, "Kirib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring."))
          } finally {
               setChecking(false)
          }
     }

     async function handleNewPassword(e) {
          e.preventDefault()
          setError("")

          // Kirishda parol trim qilinadi, shuning uchun saqlashda ham trim: aks holda "abc " saqlanib, hech qachon kira olmaydi
          const password = newPasswordRef.current.value.trim()
          const repeat = repeatRef.current.value.trim()

          if (password.length < MIN_PASSWORD) {
               setError(`Parol kamida ${MIN_PASSWORD} ta belgidan iborat bo'lsin`)
               return
          }
          if (password !== repeat) {
               setError("Parollar bir xil emas")
               return
          }

          if (saving) return // ikki marta bosib yuborilsa ikkinchi so'rov ketmasin
          const entity = "Parol"
          dispatch({ type: "PUT_pending", payload: { entity } })
          try {
               const { data } = await api.post("/auth/change-password", { new_password: password })
               setAccessToken(data.access_token)
               dispatch({ type: "PUT_success", payload: { entity } })
               finish(data.user)
          } catch (err) {
               dispatch({ type: "PUT_error", payload: { entity, error: err } })
               setError(apiMessage(err, ""))
          }
     }

     return <Page>
          <Grid>
               <section aria-labelledby="login-title">
                    {pending ? <>
                         <Title id="login-title">Yangi parol</Title>
                         <Form onSubmit={handleNewPassword}>
                              <Notice>Administrator bergan parol vaqtinchalik. O'zingiz eslab qoladigan yangi parol yarating.</Notice>
                              <Field>
                                   <label htmlFor="new-password">Yangi parol</label>
                                   <Input id="new-password" ref={newPasswordRef} type="password" autoComplete="new-password" autoFocus required />
                                   <small>Kamida {MIN_PASSWORD} ta belgi</small>
                              </Field>
                              <Field>
                                   <label htmlFor="repeat-password">Parolni takrorlang</label>
                                   <Input id="repeat-password" ref={repeatRef} type="password" autoComplete="new-password" required />
                              </Field>
                              <Submit type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Parolni saqlash"}</Submit>
                              {error && <Notice role="alert" $tone="error">{error}</Notice>}
                         </Form>
                    </> : <>
                         <Title id="login-title">Kirish</Title>
                         <Form onSubmit={handleLogin}>
                              <Field>
                                   <label htmlFor="login">Login</label>
                                   <Input id="login" ref={loginRef} type="text" autoComplete="username" required />
                                   <small>Administrator bergan login, telefon raqami yoki kartadagi kod</small>
                              </Field>
                              <Field>
                                   <label htmlFor="password">Parol</label>
                                   <Input id="password" ref={passwordRef} type="password" autoComplete="current-password" required />
                              </Field>

                              <Submit type="submit" disabled={checking}>{checking ? "Kirilmoqda..." : "Kirish"}</Submit>
                              {error && <Notice role="alert" $tone="error">{error}</Notice>}
                         </Form>
                    </>}


               </section>

               <Info aria-labelledby="no-account">
                    <InfoTitle id="no-account">Akkaunt yo'qmi?</InfoTitle>
                    <InfoLead>
                         Bu saytda o'zingiz ro'yxatdan o'ta olmaysiz. Hisobingizni zal administratori ochib beradi.
                    </InfoLead>

                    <Steps>
                         {STEPS.map(({ title, text }) => (
                              <li key={title}>
                                   <strong>{title}</strong>
                                   <span>{text}</span>
                              </li>
                         ))}
                    </Steps>

                    <Cases>
                         {CASES.map(({ q, a }) => (
                              <details key={q}>
                                   <summary>{q}</summary>
                                   <p>{a}</p>
                              </details>
                         ))}
                    </Cases>

                    <Contact>
                         Savolingiz bo'lsa: <a href={`tel:${PHONE}`}>{PHONE_VIEW}</a> yoki{" "}
                         <a href={`https://www.instagram.com/${INSTAGRAM}/`} target="_blank" rel="noreferrer">@{INSTAGRAM}</a>
                    </Contact>
               </Info>
          </Grid>
     </Page>
}

export default Login