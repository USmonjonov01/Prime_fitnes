/* ------------------------------------------------------------------------------------------
   ADMINS REDUCER: ichki tizimning admin tomoni (xodim va ega) holati.

   State (null bo'lsa "hech kim kirmagan" hisoblanadi):
     {
       user:          { id, full_name, phone_number, role: "staff" | "owner" } | null
       data:          admins/Dashboard ning `data` propi (stats, visits, expiring, cashflow) | null.
                      null bo'lsa Dashboard namuna ma'lumot ko'rsatadi
       checkInResult: { tone: "ok" | "error", message } | null   oxirgi "Kirishni belgilash" natijasi
     }

   Action: { type, payload }
     LOGIN               { user }                 kirgan admin. Faqat staff va owner qabul qilinadi, boshqa rol e'tiborsiz qoladi.
                                                  Parol va ichki maydonlar (password_hash, must_change_password) saqlanmaydi
     LOGOUT                                       hammasini tozalaydi (state null bo'ladi)
     UPDATE_USER         { full_name?, phone_number?, code? }   profil o'zgarganda. id va role o'zgarmaydi
     SET_DATA            <data> | null            Dashboard ma'lumoti (backenddan kelgach)
     SET_CHECK_IN_RESULT { tone, message }        kirishni belgilash natijasi
     CLEAR_CHECK_IN                               natijani yopish

   Noma'lum action yoki noto'g'ri payload bo'lsa state o'zgarmaydi (xato ham bermaydi).
   Reducer toza funksiya: vaqt, tasodifiy son va localStorage ishlatilmaydi.
------------------------------------------------------------------------------------------ */

const ROLES = ["staff", "owner"]
const EMPTY = { user: null, data: null, checkInResult: null }

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)

// Foydalanuvchidan faqat kerakli maydonlar olinadi. Rol mos kelmasa yoki id bo'lmasa null
const cleanUser = (raw) => {
     if (!isObject(raw) || !ROLES.includes(raw.role) || raw.id == null) return null
     const user = { id: raw.id, full_name: raw.full_name, phone_number: raw.phone_number, role: raw.role }
     if (raw.code) user.code = raw.code
     return user
}

export default function reducer(state, { type, payload } = {}) {
     const current = state ?? EMPTY

     switch (type) {
          case "LOGIN": {
               const user = cleanUser(payload?.user)
               return user ? { ...EMPTY, user } : state // boshqa foydalanuvchi kirsa oldingi ma'lumot tozalanadi
          }

          case "LOGOUT":
               return null

          case "UPDATE_USER": {
               if (!current.user || !isObject(payload)) return state
               // id va role payload dan olinmaydi: profil orqali rolni o'zgartirib bo'lmaydi
               const user = cleanUser({ ...current.user, ...payload, id: current.user.id, role: current.user.role })
               return user ? { ...current, user } : state
          }

          case "SET_DATA":
               if (payload !== null && !isObject(payload)) return state
               return { ...current, data: payload }

          case "SET_CHECK_IN_RESULT":
               if (!isObject(payload) || !["ok", "error"].includes(payload.tone) || typeof payload.message !== "string") return state
               return { ...current, checkInResult: { tone: payload.tone, message: payload.message } }

          case "CLEAR_CHECK_IN":
               return current.checkInResult ? { ...current, checkInResult: null } : state

          default:
               return state
     }
}