import { css } from "styled-components"

// Gym Prime Fit dizayn tokenlari.
// Ranglar zalning o'zidan olingan: ko'k devorlar, shiftdagi neon LED chiziq, to'q shift.
// Aniq qiymatlar keyin asl logo faylidan tekshiriladi.

export const colors = {
     night: "#050918",     // sahifa foni, eng to'q
     deep: "#0A1230",      // to'q ko'k, bloklar foni
     wall: "#1B3BE8",      // zal devori (katta maydonlar)
     electric: "#3D63FF",  // asosiy tugmalar, faol elementlar
     electricHover: "#5877FF",
     neon: "#8DB4FF",      // LED chiziq nuri, faol chiziqlar
     steel: "#B4C0E4",     // ikkinchi darajali matn
     floor: "#EAF0FF",     // asosiy matn
     line: "rgba(141, 180, 255, 0.18)",

     // Ichki tizim (dashboard) uchun holat ranglari. Brend rangi bilan aralashmasligi kerak.
     ok: "#2FD38C",
     warn: "#F5B83D",
     danger: "#FF5D5D",

     // Faqat logo uchun, interfeysda ishlatilmaydi.
     flame: "#FF5A1F",
}

export const gradients = {
     // Zal ichi: tepada shift soyasi, o'rtada yoritilgan devor, pastda pol.
     hall: `radial-gradient(120% 75% at 28% 38%, ${colors.wall} 0%, #112594 34%, #08113A 62%, ${colors.night} 100%)`,
     // LED chiziq ostidagi devorga tushgan nur.
     wash: "linear-gradient(180deg, rgba(141, 180, 255, 0.26) 0%, rgba(141, 180, 255, 0.07) 34%, rgba(141, 180, 255, 0) 62%)",
     // Oylik abonement bloki.
     ticket: `linear-gradient(140deg, ${colors.wall} 0%, #1530B8 55%, #0F2189 100%)`,
     // Aloqa bandi.
     band: `linear-gradient(120deg, #0F2189 0%, ${colors.wall} 60%, #2A4DF0 100%)`,
}

export const fonts = {
     heading: `"Archivo", "Arial Narrow", system-ui, sans-serif`,
     body: `"Hanken Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif`,
}

// Sarlavhalar uchun yagona uslub: keng (wdth 125) va og'ir (800) Archivo.
export const display = css`
     font-family: ${fonts.heading};
     font-weight: 800;
     font-stretch: 125%;
     letter-spacing: -0.02em;
     line-height: 0.98;
`

export const layout = {
     navHeight: "72px",
     maxWidth: "1240px",
     gutter: "clamp(1.25rem, 4vw, 3rem)",
     radius: "6px",
}

// Mobile-first: asosiy uslub telefon uchun, katta ekranlar shu media bilan qo'shiladi.
export const media = {
     tablet: "@media (min-width: 768px)",
     desktop: "@media (min-width: 1100px)",
}