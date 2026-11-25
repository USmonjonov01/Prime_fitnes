import axios from "axios"

// Backend (Express + Prisma + Neon). Manzil .env dagi VITE_API_URL dan olinadi.
// Access token faqat xotirada turadi (localStorage da emas): XSS bo'lsa ham uzoq muddatli kalit o'g'irlanmaydi.
// Refresh token esa httpOnly cookie da, JavaScript uni ko'ra olmaydi.
const baseURL = import.meta.env.VITE_API_URL

let accessToken = null
export const setAccessToken = (token) => { accessToken = token }
export const getAccessToken = () => accessToken

const api = axios.create({
     baseURL,
     timeout: 20000, // Neon uxlab yotgan bo'lsa birinchi so'rov sekinroq javob beradi
     withCredentials: true, // refresh cookie uchun
     headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
     if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
     return config
})

// Bir vaqtda bir nechta so'rov 401 olsa, refresh faqat bir marta chaqiriladi
let refreshing = null
export const refreshSession = () => {
     refreshing ??= axios.post(`${baseURL}/auth/refresh`, null, { withCredentials: true, timeout: 20000 })
          .then(({ data }) => { accessToken = data.access_token; return data })
          .catch((error) => { accessToken = null; throw error })
          .finally(() => { refreshing = null })
     return refreshing
}

const AUTH_URL = /^\/auth\/(login|refresh)/

api.interceptors.response.use(
     (response) => response,
     async (error) => {
          const { config, response } = error
          const code = response?.data?.error?.code
          const expired = response?.status === 401 && (code === "TOKEN_EXPIRED" || code === "UNAUTHORIZED")

          if (expired && config && !config._retried && !AUTH_URL.test(config.url ?? "")) {
               config._retried = true
               try {
                    await refreshSession()
                    return api(config)
               } catch {
                    // Sessiya tiklanmadi: tizimdan chiqarib, login sahifasiga o'tkazamiz
                    localStorage.removeItem("userData")
                    if (window.location.pathname !== "/login") window.location.assign("/login")
               }
          }
          return Promise.reject(error)
     },
)

// Serverdagi xato matni (o'zbekcha), bo'lmasa berilgan matn
export const apiMessage = (error, fallback = "Xatolik yuz berdi. Qayta urinib ko'ring.") =>
     error?.response?.data?.error?.message ?? fallback

export default api
