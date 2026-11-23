import { useEffect, useRef, useState } from "react"
import {
     Cases, Contact, Field, Form, Grid, Info, InfoLead, InfoTitle, Input, Notice, Page, Secondary, Steps, Submit, Title,
} from "./style"
import { INSTAGRAM, PHONE, PHONE_VIEW } from "../../utils/gym"
import api, { adminApi } from "../../axios"
import { useNavigate } from "react-router-dom"
import { homeOf } from "../../utils/sidebar"

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

const MIN_PASSWORD = 4

// Raqam bo'lmagan hamma belgini olib tashlaydi: "+998 90 111-22-33" → "998901112233"
const digits = (s) => String(s ?? "").replace(/\D/g, "")

// Ikkala raqamning oxirgi 9 ta raqamini solishtiradi, shuning uchun yozilish usuli muhim emas
const samePhone = (a, b) => {
     const x = digits(a)
     const y = digits(b)
     return x.length >= 9 && y.length >= 9 && x.slice(-9) === y.slice(-9)
}

const Login = () => {
     // Inputlar useRef bilan o'qiladi (forma maydonlari boshqarilmaydi)
     const loginRef = useRef(null)
     const passwordRef = useRef(null)
     const newPasswordRef = useRef(null)
     const repeatRef = useRef(null)
     
     
     const [data, setData] = useState([])
     const [pending, setPending] = useState(null) // parolni almashtirishni kutayotgan foydalanuvchi: { user, zone }
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState("")
     const [isAdmin, setIsAdmin] = useState("")
     const navigate = useNavigate()
     
     // Ro'yxat har safar "Men adminman" almashganda qayta yuklanadi. Eski so'rov kech kelib, yangisining
     // ustidan yozib yubormasligi uchun cleanup da "bekor qilindi" belgisi qo'yiladi.
     useEffect(() => {
          let cancelled = false

          async function getSession() {
               // Yuklanguncha tugma o'chiq turadi va eski ro'yxat tozalanadi: boshqa tomonning ro'yxati bilan
               // solishtirib "login noto'g'ri" deb chiqib qolmasligi uchun
               setLoading(true)
               setData([])
               setError("")
               try {
                    const response = await api.get(isAdmin === "admin" ? `${adminApi}/admins`: "/register")
                    if (!cancelled) setData(response.data)
               } catch (err) {
                    if (!cancelled) setError("Serverga ulanib bo'lmadi. Sahifani yangilab ko'ring.")
                    console.log(err.message)
               } finally {
                    if (!cancelled) setLoading(false)
               }
          }

          getSession()
          return () => { cancelled = true }
     }, [isAdmin]);

     function checked(e){
          setIsAdmin(e.target.checked ? "admin" : "customer")
     }

     function finish(user) {
          // "Men adminman" belgilanmagan bo'lsa mijoz. Belgilangan bo'lsa admin: roli adminlar yozuvidan olinadi,
          // noma'lum bo'lsa eng past huquq (staff) beriladi.
          const role = isAdmin === "admin" ? (["staff", "owner"].includes(user.role) ? user.role : "staff") : "customer"

          // Brauzerga faqat kerakli maydonlar yoziladi. Parol (password_hash) va ichki maydonlar yozilmaydi.
          const saved = { id: user.id, full_name: user.full_name, phone_number: user.phone_number, role }
          if (user.code) saved.code = user.code
          
          localStorage.setItem("userData", JSON.stringify(saved)) // avval saqlaymiz, keyin o'tamiz
          navigate(homeOf(role), { replace: true })
     }

     function getFilterUSer(e) {
          e.preventDefault()
          if (loading) return
          setError("")

          // Ro'yxat kelmagan bo'lsa (server xatosi) "login noto'g'ri" demaymiz: sabab boshqa
          if (!data.length) {
               setError("Foydalanuvchilar ro'yxati yuklanmadi. Sahifani yangilab ko'ring.")
               return
          }

          const login = loginRef.current.value.trim()
          const password = passwordRef.current.value.trim()

          // 9 ta va undan ko'p raqam bo'lsa telefon, aks holda kartadagi kod deb olinadi
          const isPhone = digits(login).length >= 9

          // Parol: yangi parol saqlangan bo'lsa (password_hash) faqat o'sha, hali saqlanmagan bo'lsa kartadagi kod.
          // Shunda parol almashgach eski kod endi kirmaydi. Bo'sh parol hech qachon mos kelmaydi.
          // vaqtinchalik sinov usuli, keyin password_hash tekshiruvi backendga o'tadi
          const secretOf = (obj) => String(obj.password_hash || obj.code || "")

          const user = data.find((obj) =>
               (isPhone ? samePhone(obj.phone_number, login) : obj.code != null && String(obj.code) === login)
               && secretOf(obj) !== "" && secretOf(obj) === password
          )

          if (!user) {
               setError("Login yoki parol noto'g'ri")
               return
          }
          if (user.status !== "active") {
               setError("Hisobingiz faol emas. Administratorga murojaat qiling.")
               return
          }
          if (user.must_change_password) {
               setPending({ user })
               return
          }
          finish(user)
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


          if (loading) return // ikki marta bosib yuborilsa ikkinchi so'rov ketmasin
          setLoading(true)
          try {
               await api.put(isAdmin === "admin" ? `${adminApi}/admins/${pending.user.id}` :`/register/${pending.user.id}`, { "must_change_password": false, "password_hash": password })
               finish({ ...pending.user, must_change_password: false })
          } catch (error) {
               setError("Serverga ulanib bo'lmadi. Keyinroq urinib ko'ring.")
               console.log(error.message);
          } finally {
               setLoading(false)
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
                              <Submit type="submit" disabled={loading}>{loading ? "Saqlanmoqda..." : "Parolni saqlash"}</Submit>
                              {error && <Notice role="alert" $tone="error">{error}</Notice>}
                         </Form>
                    </> : <>
                         <Title id="login-title">Kirish</Title>
                         <Form onSubmit={getFilterUSer}>
                              <Field>
                                   <label htmlFor="login">Login</label>
                                   <Input id="login" ref={loginRef} type="text" autoComplete="username" required />
                                   <small>Administrator bergan login, telefon raqami yoki kartadagi kod</small>
                              </Field>
                              <Field>
                                   <label htmlFor="password">Parol</label>
                                   <Input id="password" ref={passwordRef} type="password" autoComplete="current-password" required />
                              </Field>

                              <Field $prop="checkbox">
                                   <input id="is-admin" type="checkbox" onChange={checked}/>
                                   <label htmlFor="is-admin">Men adminman</label>
                              </Field>

                              <Submit type="submit" disabled={loading}>{loading ? "Kirilmoqda..." : "Kirish"}</Submit>
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