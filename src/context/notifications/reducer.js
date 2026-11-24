/* ------------------------------------------------------------------------------------------
   Bildirishnoma reducer: CRUD natijalari uchun javob tuzilmasi.

   STATE (null yoki):
     {
       id:      son, har yangi bildirishnomada 1 ga oshadi (bir xil matn ketma-ket kelsa ham interfeys yangilanadi)
       status:  "pending" | "success" | "error"   pending: so'rov ketdi, javob kutilmoqda
       method:  "GET" | "POST" | "PUT" | "DELETE" | "NETWORK"
       message: foydalanuvchiga ko'rsatiladigan matn
       code:    xato sababi (faqat error): "network" | "timeout" | "validation" | "unauthorized" | "forbidden"
                | "not_found" | "conflict" | "rate_limit" | "server" | "unknown"
     }

   ACTION:
     { type: "<METHOD>_pending" | "<METHOD>_success" | "<METHOD>_error" | "CLEAR", payload?: { entity?, error? } }
       METHOD  GET | POST | PUT | DELETE        (tahrirlash uchun PUT, eski "EDIT" emas)
       entity  nima ustida amal bajarildi, bosh harf bilan: "Mijoz", "Abonement", "Chiqim".
               Berilmasa "Ma'lumotlar" deyiladi.
       error   axios xatosi: status va sabab reducerning o'zida aniqlanadi (so'rov joyida tahlil qilish shart emas)

   Ishlatilishi:
     dispatch({ type: "POST_pending", payload: { entity: "Mijoz" } })   // so'rov ketishidan oldin
     dispatch({ type: "POST_success", payload: { entity: "Mijoz" } })
     dispatch({ type: "POST_error", payload: { entity: "Mijoz", error: err } })
     dispatch({ type: "CLEAR" })                       // bildirishnomani yopish

   Reducer toza funksiya: vaqt yoki tasodifiy son ishlatmaydi (StrictMode ikki marta chaqirsa ham bir xil natija).
------------------------------------------------------------------------------------------ */

const METHODS = ["GET", "POST", "PUT", "DELETE"]

// Kutish: "<Nima> <fe'l>...". Javob kelgach shu bildirishnoma success yoki error bilan almashadi.
const PENDING_VERB = {
     GET: "yuklanmoqda",
     POST: "saqlanmoqda",
     PUT: "yangilanmoqda",
     DELETE: "o'chirilmoqda",
}

// Muvaffaqiyat: "<Nima> muvaffaqiyatli <fe'l>!". GET da odatda bildirishnoma ko'rsatilmaydi, lekin kerak bo'lsa matn tayyor.
const SUCCESS_VERB = {
     GET: "yuklandi",
     POST: "saqlandi",
     PUT: "yangilandi",
     DELETE: "o'chirildi",
}

// Xato: "<Nima>ni <fe'l> bo'lmadi". Sababi alohida gap bilan to'ldiriladi (pastda).
const FAIL_VERB = {
     GET: "yuklab bo'lmadi",
     POST: "saqlab bo'lmadi",
     PUT: "yangilab bo'lmadi",
     DELETE: "o'chirib bo'lmadi",
}

// Xato sababi: kod va foydalanuvchiga tushunarli izoh
const REASONS = {
     network: "Internetga ulanishda muammo.",
     timeout: "Server javob bermadi. Qayta urinib ko'ring.",
     validation: "Kiritilgan ma'lumot noto'g'ri.",
     unauthorized: "Qaytadan tizimga kiring.",
     forbidden: "Bu amal uchun ruxsatingiz yo'q.",
     not_found: "Ma'lumot topilmadi.",
     conflict: "Bunday ma'lumot allaqachon mavjud.",
     rate_limit: "So'rovlar juda ko'p. Birozdan keyin urinib ko'ring.",
     server: "Serverda xatolik. Birozdan keyin urinib ko'ring.",
     unknown: "Noma'lum xatolik.",
}

// axios xatosidan sabab kodini aniqlaydi
const reasonOf = (error) => {
     if (!error) return "unknown"
     if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") return "timeout"
     if (!error.response) return "network" // javob umuman kelmadi: internet yo'q yoki server yetib bo'lmaydi

     const status = error.response.status
     if (status === 400 || status === 422) return "validation"
     if (status === 401) return "unauthorized"
     if (status === 403) return "forbidden"
     if (status === 404) return "not_found"
     if (status === 409) return "conflict"
     if (status === 429) return "rate_limit"
     if (status >= 500) return "server"
     return "unknown"
}

// "Mijoz" + "saqlanmoqda" -> "Mijoz saqlanmoqda...", entity bo'lmasa "Ma'lumotlar ..."
const pendingMessage = (method, entity = "Ma'lumotlar") => `${entity} ${PENDING_VERB[method]}...`

// "Mijoz" + "saqlandi" -> "Mijoz muvaffaqiyatli saqlandi!", entity bo'lmasa "Ma'lumotlar ..."
const successMessage = (method, entity = "Ma'lumotlar") => `${entity} muvaffaqiyatli ${SUCCESS_VERB[method]}!`

// "Mijozni saqlab bo'lmadi. Bunday ma'lumot allaqachon mavjud."
const errorMessage = (method, entity, code) => {
     const subject = entity ? `${entity}ni` : "Ma'lumotlarni"
     return `${subject} ${FAIL_VERB[method]}. ${REASONS[code]}`
}

export const reducer = (state, { type, payload = {} }) => {
     if (type === "CLEAR") return null

     const [method, status] = String(type).split("_")
     if (!METHODS.includes(method) || (status !== "pending" && status !== "success" && status !== "error")) return state // noma'lum action: holat o'zgarmaydi

     const id = (state?.id ?? 0) + 1

     if (status === "pending") {
          return { id, status, method, message: pendingMessage(method, payload.entity) }
     }

     if (status === "success") {
          return { id, status, method, message: successMessage(method, payload.entity) }
     }

     const code = reasonOf(payload.error)
     return {
          id,
          status,
          method: code === "network" ? "NETWORK" : method,
          code,
          message: errorMessage(method, payload.entity, code),
     }
}