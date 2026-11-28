/* ------------------------------------------------------------------------------------------
   MESSAGES REDUCER: adminlar va mijozlar uchun xabarlarni (message) tuzadi.

   State: xabarlar ro'yxati, eng yangisi birinchi (null bo'lsa bo'sh ro'yxat hisoblanadi). Eng ko'pi MAX_MESSAGES ta.
   Xabar: { id, at, audience, clientId?, kind, title, text, read }
     audience   "admin" | "client"   xabar kimga ko'rinadi
     clientId   audience "client" bo'lsa: qabul qiluvchi mijoz. "admin" bo'lsa: xabar qaysi mijoz haqida
     kind       "success" | "info" | "warning"
     at         yaratilgan vaqt (ms). Ko'rsatish (soat, "5 daqiqa oldin") UI ning ishi

   Bitta voqea bir nechta xabar tug'dirishi mumkin: masalan mijoz kirganda adminga "X zalga kirdi",
   mijozning o'ziga "Kirishingiz tasdiqlandi" xabari bo'ladi.

   Reducer sof (pure) bo'lishi uchun id va vaqt uni ichida yaratilmaydi, action bilan keladi.
   Action ni message() yordamchisi tayyorlaydi:

        dispatch(message("CHECK_IN", { client, method: "qr", visitsLeft: 8 }))

   Voqealar (type: payload). client = { id, full_name, code? }

     CHECK_IN              { client, method?: "qr" | "code", visitsLeft? }          mijoz kirdi
     CHECK_OUT             { client, method?, durationMin? }                        mijoz chiqdi
     CHECK_IN_DENIED       { client?, code?, reason?: "not_found" | "expired" | "finished" | "blocked" }
                                                                                    kirishga ruxsat berilmadi
     CUSTOMER_ADDED        { client }                                               yangi mijoz qo'shildi
     SUBSCRIPTION_SOLD     { client, plan, price, visitTotal?, endDate? }           abonement sotildi (plan: nom, masalan "1 oylik")
     CUSTOMER_STATUS_CHANGED { client, from, to }                                   mijoz holati o'zgardi ("active" -> ...)

   Xabarlarni boshqarish:
     READ                  { id }                                                   bittasini o'qilgan qilish
     READ_ALL              { audience, clientId? }                                  shu auditoriyaning hammasini o'qilgan qilish
     REMOVE                { id }                                                   bittasini o'chirish
------------------------------------------------------------------------------------------ */

const MAX_MESSAGES = 50

/* ------------------------------ Action tayyorlash ------------------------------ */

// id va vaqt shu yerda beriladi (reducer ichida emas), shuning uchun reducer har doim bir xil natija beradi
export const message = (type, payload) => ({
     type,
     payload,
     id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
     at: Date.now(),
})

/* ------------------------------ Yordamchilar ------------------------------ */

const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]

const money = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")

// "2026-12-30" -> "30-dekabr, 2026". Sana noto'g'ri bo'lsa null (gap tushirib qoldiriladi)
const formatDate = (value) => {
     const date = new Date(value)
     if (!value || Number.isNaN(date.getTime())) return null
     return `${date.getDate()}-${MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}

// 80 -> "1 soat 20 daqiqa"
const formatDuration = (minutes) => {
     if (!Number.isFinite(minutes) || minutes <= 0) return null
     const h = Math.floor(minutes / 60)
     const m = Math.round(minutes % 60)
     return [h && `${h} soat`, m && `${m} daqiqa`].filter(Boolean).join(" ")
}

// Matn bo'laklarini probel bilan birlashtiradi, bo'sh (null, false) bo'laklar tashlab ketiladi
const sentence = (...parts) => parts.filter(Boolean).join(" ")

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

const nameOf = (client) => client?.full_name || "Mijoz"

const via = (method) => (method === "qr" ? "QR kod orqali" : "kod orqali")

// Mijoz holatlari. Ro'yxatda yo'q holat o'zining nomi bilan ko'rsatiladi.
const STATUS = {
     active: { label: "Faol", kind: "success" },
     inactive: { label: "Nofaol", kind: "info" },
     frozen: { label: "Muzlatilgan", kind: "info" },
     blocked: { label: "Bloklangan", kind: "warning" },
}

const statusOf = (value) => STATUS[value] ?? { label: String(value ?? "noma'lum"), kind: "info" }

const DENIED_REASON = {
     expired: "abonement muddati tugagan",
     finished: "abonement tashriflari tugagan",
     blocked: "mijoz bloklangan",
     already_today: "bugun allaqachon belgilangan",
     qr_expired: "QR kod muddati tugagan",
     qr_invalid: "QR kod noto'g'ri",
}

// Mijozning o'ziga ko'rsatiladigan matn, "administratorga murojaat qiling" mos kelmaydigan sabablar uchun
const CLIENT_REASON_TEXT = {
     already_today: "Bugungi kirishingiz allaqachon belgilangan.",
     qr_expired: "QR kodingiz eskirgan edi. Sahifa o'zi yangilanadi, kodni qayta ko'rsating.",
}

/* ------------------------------ Xabar tuzuvchilar ------------------------------ */
// Har biri payload dan xabarlar ro'yxatini tuzadi: har xabarda audience, kind, title, text (va clientId)

const BUILDERS = {
     CHECK_IN: ({ client, method, visitsLeft }) => {
          const left = Number.isFinite(visitsLeft) && `Qolgan tashriflar: ${visitsLeft}.`
          return [
               {
                    audience: "admin", clientId: client?.id, kind: "success", title: "Zalga kirdi",
                    text: sentence(`${nameOf(client)} ${via(method)} zalga kirdi.`, left),
               },
               {
                    audience: "client", clientId: client?.id, kind: "success", title: "Kirish tasdiqlandi",
                    text: sentence("Zalga kirishingiz tasdiqlandi.", left),
               },
          ]
     },

     CHECK_OUT: ({ client, method, durationMin }) => {
          const duration = formatDuration(durationMin)
          return [
               {
                    audience: "admin", clientId: client?.id, kind: "info", title: "Zaldan chiqdi",
                    text: sentence(`${nameOf(client)} ${via(method)} zaldan chiqdi.`, duration && `Zalda ${duration} bo'ldi.`),
               },
               {
                    audience: "client", clientId: client?.id, kind: "info", title: "Chiqish tasdiqlandi",
                    text: sentence("Zaldan chiqishingiz tasdiqlandi.", duration && `Mashg'ulot davomiyligi: ${duration}.`),
               },
          ]
     },

     CHECK_IN_DENIED: ({ client, code, reason }) => {
          // Kod bo'yicha hech kim topilmadi: faqat adminga, qayta urinish yo'li bilan
          if (!client) {
               return [{
                    audience: "admin", kind: "warning", title: "Kirishga ruxsat berilmadi",
                    text: sentence(code ? `Kod ${code} bo'yicha mijoz topilmadi.` : "Mijoz topilmadi.", "Kodni tekshirib, qayta kiriting."),
               }]
          }

          const why = DENIED_REASON[reason]
          return [
               {
                    audience: "admin", clientId: client.id, kind: "warning", title: "Kirishga ruxsat berilmadi",
                    text: why ? `${nameOf(client)}: ${why}.` : `${nameOf(client)} zalga kira olmadi.`,
               },
               {
                    audience: "client", clientId: client.id, kind: "warning", title: "Kirish tasdiqlanmadi",
                    text: CLIENT_REASON_TEXT[reason]
                         ?? sentence(why ? `${capitalize(why)}.` : "Sababi aniqlanmadi.", "Administratorga murojaat qiling."),
               },
          ]
     },

     CUSTOMER_ADDED: ({ client }) => {
          const code = client?.code
          return [
               {
                    audience: "admin", clientId: client?.id, kind: "success", title: "Yangi mijoz qo'shildi",
                    text: `${nameOf(client)}${code ? `, kodi ${code}` : ""}.`,
               },
               {
                    audience: "client", clientId: client?.id, kind: "success", title: "Prime Fit ga xush kelibsiz",
                    text: sentence("Siz tizimga qo'shildingiz.", code && `Zalga kirganda kodingizni ayting: ${code}.`),
               },
          ]
     },

     SUBSCRIPTION_SOLD: ({ client, plan, price, visitTotal, endDate }) => {
          const name = plan ? `${plan} abonement` : "Abonement"
          const until = formatDate(endDate)
          return [
               {
                    audience: "admin", clientId: client?.id, kind: "success", title: "Abonement sotildi",
                    text: sentence(`${nameOf(client)} uchun ${name.toLowerCase()} sotildi.`, Number.isFinite(price) && `Narxi: ${money(price)} so'm.`),
               },
               {
                    audience: "client", clientId: client?.id, kind: "success", title: "Abonement faollashtirildi",
                    text: sentence(
                         `${name}ingiz faollashtirildi.`,
                         Number.isFinite(visitTotal) && `Tashriflar soni: ${visitTotal}.`,
                         until && `${until} gacha amal qiladi.`,
                    ),
               },
          ]
     },

     CUSTOMER_STATUS_CHANGED: ({ client, from, to }) => {
          const next = statusOf(to)
          const text = {
               active: "Hisobingiz faollashtirildi. Zalga kirishingiz mumkin.",
               blocked: "Hisobingiz bloklandi. Sababini bilish uchun administratorga murojaat qiling.",
          }[to] ?? `Yangi holat: ${next.label}. Savollar bo'lsa administratorga murojaat qiling.`

          return [
               {
                    audience: "admin", clientId: client?.id, kind: next.kind, title: "Mijoz holati o'zgardi",
                    text: `${nameOf(client)} “${statusOf(from).label}” holatidan “${next.label}” holatiga o'tkazildi.`,
               },
               {
                    audience: "client", clientId: client?.id, kind: next.kind, title: "Holatingiz o'zgardi",
                    text,
               },
          ]
     },
}

// Serverdagi voqea (type + payload) uchun ko'rsatiladigan matn: { audience, kind, title, text }.
// Voqea shu auditoriyaga mo'ljallanmagan bo'lsa null (masalan, kodi topilmagan urinish mijozga ko'rinmaydi).
export const describe = (type, payload, audience) => BUILDERS[type]?.(payload ?? {}).find((m) => m.audience === audience) ?? null

/* ------------------------------ Reducer ------------------------------ */

const reducer = (state, action) => {
     const list = state ?? []
     const { type, payload = {} } = action

     switch (type) {
          case "READ":
               return list.map((m) => (m.id === payload.id ? { ...m, read: true } : m))

          case "READ_ALL":
               return list.map((m) => (
                    m.audience === payload.audience && (m.audience !== "client" || m.clientId === payload.clientId)
                         ? { ...m, read: true }
                         : m
               ))

          case "REMOVE":
               return list.filter((m) => m.id !== payload.id)

          default: {
               const build = BUILDERS[type]
               if (!build) return state // noma'lum voqea: holat o'zgarmaydi

               const created = build(payload).map((m, i) => ({
                    id: `${action.id ?? type}-${i}`,
                    at: action.at ?? 0,
                    read: false,
                    ...m,
               }))
               return [...created, ...list].slice(0, MAX_MESSAGES)
          }
     }
}

export default reducer