import axios from "axios"

// Ikkita alohida API bor: mijozlar/abonementlar va adminlar/chiqimlar (ular boshqa mockapi akkauntida).
// Manzillar .env faylidan olinadi, kodga yozilmaydi. Supabase ga o'tganda faqat .env o'zgaradi.
export const adminApi = import.meta.env.VITE_ADMIN_API_URL
const customersApi = import.meta.env.VITE_API_URL
const api = axios.create({
     baseURL: customersApi,
     timeout: 7000, 
     headers: { "Content-Type": "application/json" },
})

export default api

