// Zalning statik ma'lumotlari. Home va About shu yerdan oladi, shunda telefon, narx va manzil
// ikki joyda ikki xil bo'lib qolmaydi. Backend ulangach shu fayl API chaqiruvi bilan almashtiriladi.

export const PHONE = "+998910547700"
export const PHONE_VIEW = "+998 91 054 77 00"
export const INSTAGRAM = "gym_prime_fit"

export const ADDRESS = ["Gulobod MFY, 160-uy", "Med kollej pastki tomonida"]

// TODO: zal egasidan so'rang. Masalan: [{ days: "Dushanba–Shanba", time: "06:00–22:00" }].
// Bo'sh qolsa About sahifasida "Ish vaqti" qatori ko'rinmaydi (to'qib yozmaymiz).
export const HOURS = []

export const EQUIPMENT = [
     { title: "Ganteller va shtangalar", text: "Erkin og'irliklar bilan ishlash uchun alohida maydon." },
     { title: "Stoykalar", text: "Cho'kish va tortish mashqlari uchun po'lat stoykalar." },
     { title: "Skameykalar va trenajyorlar", text: "Har bir mushak guruhi uchun jihoz." },
]

// Qo'shimcha xizmatlar (masalan, shaxsiy murabbiy bilan mashq). Zal egasi tasdiqlamaguncha bo'sh turadi,
// Xizmatlar sahifasida faqat confirmed: true bo'lganlari ko'rinadi.
// Namuna: { title: "Shaxsiy mashg'ulot", text: "...", confirmed: true }
export const EXTRA_SERVICES = []

// Zal egasi aytgan abonementlar (2026-11-18). Narxi noma'lum bo'lsa price: null qoldiring,
// saytda "Narxi aniqlanmoqda" chiqadi. Narx aniq bo'lgach shu yerga yozing.
// TODO: 6 oylik va 1 yillik narxini egasidan so'rang. Amal qilish muddati qoidalarini ham aniqlang.
// Zal egasi aytgan (2026-11-18): oylik va undan uzun abonementlarda oyiga 15 martagacha kelish mumkin (kun ora).
// Bir kunlik abonementga bu cheklov tegishli emas.
export const MONTH_VISIT_LIMIT = 15
const VISITS = `Oyiga ${MONTH_VISIT_LIMIT} marta kelish mumkin (kun ora)`
const EQUIPMENT_ACCESS = "Zalning barcha jihozlaridan foydalanish"

export const PRICES = [
     {
          id: "day",
          months: null, // necha oy amal qiladi (bir kunlik uchun null)
          name: "Bir kunlik",
          note: "Bir marta kirish",
          price: "25 000",
          includes: [EQUIPMENT_ACCESS, "Kirgan kuni davomida amal qiladi"],
     },
     {
          id: "month",
          months: 1, // necha oy amal qiladi (bir kunlik uchun null)
          name: "1 oylik",
          note: "Bir oy uchun",
          price: "250 000",
          featured: true,
          includes: [EQUIPMENT_ACCESS, VISITS],
     },
     {
          id: "quarter",
          months: 3, // necha oy amal qiladi (bir kunlik uchun null)
          name: "3 oylik",
          note: "Uch oy uchun",
          price: "700 000",
          includes: [EQUIPMENT_ACCESS, VISITS],
     },
     {
          id: "half",
          months: 6, // necha oy amal qiladi (bir kunlik uchun null)
          name: "6 oylik",
          note: "Olti oy uchun",
          price: "1 300 000",
          includes: [EQUIPMENT_ACCESS, VISITS],
     },
     {
          id: "year",
          months: 12, // necha oy amal qiladi (bir kunlik uchun null)
          name: "1 yillik",
          note: "Bir yil uchun",
          price: "2 500 000",
          includes: [EQUIPMENT_ACCESS, VISITS],
     },
]

/* ------------------------------------------------------------------------------------------
   "Biz haqimizda" sahifasi uchun statik ma'lumotlar.
   Pastdagi DEMO bayroqlari true bo'lsa, sahifada "namuna" izohi ko'rinadi. Haqiqiy ma'lumot
   kiritilgach tegishli bayroqni false qiling, izoh yo'qoladi.
------------------------------------------------------------------------------------------ */

export const DEMO = {
     trainers: false, // Sobir aka haqiqiy; ikkinchi murabbiy qo'shilgach ro'yxat to'liq bo'ladi
     reviews: true,  // fikrlar namuna, keyin foydalanuvchilar yozadi
     map: true,      // xarita belgisi taxminiy (Kosonsoy markazi), zal egasidan aniq joy olinadi
}

// TODO: zal necha yildan beri ishlayotganini egasidan so'rang. Hozirgi yil namuna.
export const OPENED_YEAR = 2023

// TODO: zal egasi aytgan hikoya bilan almashtiring.
export const STORY = [
     "Prime Fit Kosonsoyda mashq qilishni xohlaganlar uchun ochilgan. Zalda erkin og'irliklar, stoykalar va trenajyorlar bir joyda turadi.",
     "Bir kunga kelib sinab ko'rishingiz yoki oylik abonement olishingiz mumkin.",
]

// Aniq koordinata: Yandex yoki Google xaritada zalni topib, belgini bosing va raqamlarni ko'chiring.
// Hozirgi qiymat Kosonsoy shahri markazi, zalning aniq joyi emas.
export const COORDS = { lat: 41.244997,  lng: 71.547507 }

// TODO: zal egasi bilan tasdiqlang. Tasdiqlanmagan qulayliklar confirmed: false bilan turadi
// va sahifada ko'rinmaydi. Tasdiqlansa, confirmed: true qiling.
export const AMENITIES = [
     { title: "Kiyinish xonasi", text: "", confirmed: false },
     { title: "Dush", text: "", confirmed: false },
     { title: "Konditsioner", text: "", confirmed: false },
     { title: "Ichimlik suvi", text: "", confirmed: false },
]

// Zalda ikki murabbiy bor. Ikkinchisining ismini egasidan so'rab, shu yerga qo'shing.
// Yo'nalish (role) va rasm hozircha yo'q: aniq bo'lgach yozing. photo bo'lmasa bosh harf chiqadi.
export const TRAINER_COUNT = 2 // egasi aytgan: zalda ikki murabbiy
export const TRAINERS = [
     { name: "Sobir aka", role: "Murabbiy", note: "", photo: null },
]

// NAMUNA fikrlar: keyinchalik foydalanuvchilar yozadi, sayt ularni birin-ketin aralash ko'rsatadi.
export const REVIEWS = [
     { id: 1, name: "Jasur", meta: "Oylik abonement", text: "Zal keng, jihozlar yetarli. Mashqni boshlashdan oldin navbat kutib o'tirmayman." },
     { id: 2, name: "Doniyor", meta: "Oylik abonement", text: "Haqiqiy texnika bilan mashq qilish alohida kayf beradi. Kech kelsam ham zal yorug' va tartibli." },
     { id: 3, name: "Sardor", meta: "Bir kunlik", text: "Narxlar oldindan aniq, shuning uchun kelishdan oldin hisoblab kelaman. Bu menga qulay." },
     { id: 4, name: "Bobur", meta: "Oylik abonement", text: "Murabbiy mashq texnikasini ko'rsatib berdi, shikastlanmasdan boshlab oldim." },
]