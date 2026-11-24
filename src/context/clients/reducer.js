/* ------------------------------------------------------------------------------------------
   CLIENTS REDUCER: ichki tizimning mijoz tomoni holati.

   State (null bo'lsa "hech kim kirmagan" hisoblanadi):
     {
       user: { id, full_name, phone_number, role: "customer", code? } | null
       data: clients/Dashboard ning `data` propi { abonement, history } | null.
             null bo'lsa Dashboard namuna ma'lumot ko'rsatadi
     }

   Action: { type, payload }
     LOGIN        { user }                 kirgan mijoz. Faqat customer qabul qilinadi, boshqa rol e'tiborsiz qoladi.
                                           Parol va ichki maydonlar (password_hash, must_change_password) saqlanmaydi
     LOGOUT                                hammasini tozalaydi (state null bo'ladi)
     UPDATE_USER  { full_name?, phone_number?, code? }   profil o'zgarganda. id va role o'zgarmaydi
     SET_DATA     <data> | null            Dashboard ma'lumoti (backenddan kelgach)

   Noma'lum action yoki noto'g'ri payload bo'lsa state o'zgarmaydi (xato ham bermaydi).
   Reducer toza funksiya: vaqt, tasodifiy son va localStorage ishlatilmaydi.
------------------------------------------------------------------------------------------ */

const ROLES = ["customer"]
const EMPTY = { user: null, data: null }

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

          default:
               return state
     }
}