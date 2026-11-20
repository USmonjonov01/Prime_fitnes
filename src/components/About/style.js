import styled, { css, keyframes } from "styled-components"
import { colors, display, fonts, layout, media } from "../../utils/theme"
import { Section, Wrap } from "../Home/style"

// Umumiy bloklar (Wrap, Section, tugmalar, Split, Intro, aloqa bandi) Home/style.js dan olinadi,
// shunda ikki sahifa bir xil ritm va bir xil dizaynda turadi. Tuzilishi esa boshqacha:
// ixcham sarlavha + raqamlar, yopishqoq ichki menyu va mazmunli bo'limlar.

const fadeIn = keyframes`
     from { opacity: 0; }
`

/* ---------- Sahifa boshi ---------- */

/* Home'dagi to'liq ekranli zal o'rniga ixcham bosh: chapda sarlavha, o'ngda zal raqamlari */
export const PageHero = styled.header`
     position: relative;
     overflow: hidden;
     padding: calc(${layout.navHeight} + clamp(2.5rem, 6vw, 4.5rem)) 0 clamp(2.5rem, 6vw, 4.5rem);
     background:
          radial-gradient(80% 130% at 0% 0%, rgba(27, 59, 232, 0.5) 0%, rgba(10, 18, 48, 0) 62%),
          ${colors.deep};
     border-bottom: 1px solid ${colors.line};
`

export const HeroGrid = styled(Wrap)`
     display: grid;
     gap: 2.5rem;
     animation: ${fadeIn} 0.7s ease backwards;

     ${media.desktop} {
          grid-template-columns: 1fr auto;
          gap: 4rem;
          align-items: end;
     }

     @media (prefers-reduced-motion: reduce) {
          animation: none;
     }
`

export const PageTitle = styled.h1`
     ${display};
     font-stretch: 115%;
     font-size: clamp(2.3rem, 8vw, 5.75rem);
     line-height: 0.95;
`

/* Zal raqamlari. Ularning chap tomonidagi LED chiziq sarlavhadan ajratib turadi */
export const Stats = styled.dl`
     position: relative;
     display: grid;
     grid-template-columns: repeat(3, auto);
     justify-content: start;
     gap: 1.5rem clamp(1.25rem, 5vw, 2.5rem);
     padding-top: 1.5rem;

     /* LED chiziq: telefonda tepada yotiq, kompyuterda chapda tik */
     &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: ${colors.neon};
          box-shadow: 0 0 8px ${colors.neon}, 0 0 18px ${colors.electric};
     }

     ${media.desktop} {
          grid-template-columns: auto;
          gap: 1.75rem;
          padding: 0.25rem 0 0.25rem 2.5rem;

          &::before {
               right: auto;
               bottom: 0;
               width: 2px;
               height: auto;
          }
     }
`

export const Stat = styled.div`
     dd {
          ${display};
          font-stretch: 112%;
          font-size: clamp(1.6rem, 6vw, 2.6rem);
     }

     dt {
          margin-top: 0.3rem;
          color: ${colors.steel};
          font-size: 0.95rem;
          line-height: 1.3;
     }
`

/* ---------- Ichki menyu ---------- */

/* Navbar ostida yopishib turadi, sahifa bo'limlariga o'tkazadi */
export const SubNav = styled.nav`
     position: sticky;
     top: ${layout.navHeight};
     z-index: 40;
     background: rgba(5, 9, 24, 0.9);
     -webkit-backdrop-filter: blur(14px);
     backdrop-filter: blur(14px);
     border-bottom: 1px solid ${colors.line};
`

export const SubNavInner = styled(Wrap)`
     display: flex;
     gap: 0.25rem;
     overflow-x: auto;
     scrollbar-width: none;

     &::-webkit-scrollbar {
          display: none;
     }
`

export const SubLink = styled.a`
     position: relative;
     flex: none;
     padding: 0.95rem 0.9rem;
     color: ${colors.steel};
     font-weight: 600;
     text-decoration: none;
     transition: color 0.2s ease;

     &:first-child {
          margin-left: -0.9rem;
     }

     &::after {
          content: "";
          position: absolute;
          left: 0.9rem;
          right: 0.9rem;
          bottom: 0;
          height: 2px;
          background: ${colors.neon};
          box-shadow: 0 0 8px ${colors.neon}, 0 0 18px ${colors.electric};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
     }

     &:hover {
          color: ${colors.floor};
     }

     &[aria-current="true"] {
          color: ${colors.floor};
     }

     &[aria-current="true"]::after {
          transform: scaleX(1);
     }

     @media (prefers-reduced-motion: reduce) {
          transition: none;

          &::after {
               transition: none;
          }
     }
`

/* Bo'limga o'tganda sarlavha Navbar va ichki menyu ostida qolib ketmasligi uchun */
export const Block = styled(Section)`
     scroll-margin-top: calc(${layout.navHeight} + 3.2rem);
`

export const AltBlock = styled(Block)`
     background: ${colors.deep};
     border-top: 1px solid ${colors.line};
     border-bottom: 1px solid ${colors.line};
`

/* Namuna ma'lumot izohi: DEMO bayrog'i true bo'lsa chiqadi */
export const DemoNote = styled.p`
     margin-top: 0.75rem;
     color: ${colors.warn};
     font-size: 0.92rem;
`

/* ---------- Zal haqida ---------- */

export const Prose = styled.div`
     display: grid;
     gap: 1rem;
     max-width: 30rem;
     margin-top: 1.5rem;
     color: ${colors.steel};
`

/* Zal haqida qisqa ma'lumot: manzil, telefon, Instagram. Karta emas, chiziqli ro'yxat */
export const Facts = styled.dl`
     border-top: 1px solid ${colors.line};
`

export const Fact = styled.div`
     display: grid;
     gap: 0.3rem;
     padding: 1.35rem 0;
     border-bottom: 1px solid ${colors.line};

     ${media.tablet} {
          grid-template-columns: 9rem 1fr;
          gap: 2rem;
          align-items: baseline;
     }

     dt {
          color: ${colors.steel};
          font-weight: 600;
     }

     dd {
          display: grid;
          gap: 0.15rem;
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 108%;
          font-size: clamp(1.1rem, 2.2vw, 1.3rem);
          line-height: 1.3;
     }

     dd span:not(:first-child) {
          color: ${colors.steel};
          font-family: ${fonts.body};
          font-weight: 400;
          font-stretch: 100%;
          font-size: 1rem;
     }

     dd a {
          text-decoration: underline;
          text-decoration-color: ${colors.neon};
          text-decoration-thickness: 2px;
          text-underline-offset: 0.2em;
          transition: color 0.2s ease;
     }

     dd a:hover {
          color: ${colors.neon};
     }

     /* Oddiy qatorlar ro'yxati (masalan, abonementga nimalar kirishi): hammasi bir xil ko'rinishda */
     ${({ $plain }) => $plain && css`
          dt {
               color: ${colors.floor};
          }

          dd {
               gap: 0.45rem;
               font-family: ${fonts.body};
               font-weight: 400;
               font-stretch: 100%;
               font-size: 1rem;
          }

          dd span:not(:first-child) {
               color: ${colors.floor};
          }
     `}
`

/* Zalning umumiy ko'rinishi uchun keng rasm. Rasm qo'yilmaguncha punktir joy turadi */
export const Panorama = styled.figure`
     position: relative;
     overflow: hidden;
     aspect-ratio: 4 / 3;
     margin-top: clamp(2.5rem, 6vw, 4.5rem);
     border-radius: ${layout.radius};
     background: ${colors.deep};

     ${media.tablet} {
          aspect-ratio: 21 / 9;
     }

     img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
     }

     ${({ $empty }) => $empty && css`
          display: grid;
          place-items: center;
          padding: 1.5rem;
          border: 1px dashed rgba(141, 180, 255, 0.4);
          background: linear-gradient(135deg, rgba(27, 59, 232, 0.35), rgba(10, 18, 48, 0.9));
          color: ${colors.steel};
          text-align: center;
     `}
`

/* ---------- Shart-sharoit ---------- */

export const SubTitle = styled.h3`
     margin-bottom: 1rem;
     font-family: ${fonts.heading};
     font-weight: 700;
     font-stretch: 110%;
     font-size: 1.25rem;
`

export const ConditionsGrid = styled.div`
     display: grid;
     gap: 3rem;
     margin-top: clamp(2rem, 5vw, 3.5rem);

     ${media.desktop} {
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
     }
`

/* ---------- Murabbiylar ---------- */

export const Trainers = styled.ul`
     list-style: none;
     display: grid;
     gap: 2.5rem 1.5rem;
     margin-top: clamp(2rem, 5vw, 3.5rem);

     ${media.tablet} {
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
     }
`

export const Trainer = styled.li`
     h3 {
          margin-top: 1rem;
          font-family: ${fonts.heading};
          font-weight: 800;
          font-stretch: 112%;
          font-size: 1.4rem;
          line-height: 1.15;
     }

     strong {
          display: block;
          margin-top: 0.2rem;
          color: ${colors.neon};
          font-weight: 600;
     }

     p {
          margin-top: 0.5rem;
          max-width: 24rem;
          color: ${colors.steel};
     }
`

/* Rasm bo'lmasa bosh harf chiqadi */
export const TrainerPhoto = styled.figure`
     display: grid;
     place-items: center;
     overflow: hidden;
     aspect-ratio: 4 / 3;
     border-radius: ${layout.radius};
     background: linear-gradient(135deg, rgba(27, 59, 232, 0.55), rgba(10, 18, 48, 0.95));
     border: 1px solid ${colors.line};

     ${media.tablet} {
          aspect-ratio: 4 / 5;
     }

     img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
     }

     span {
          ${display};
          font-stretch: 125%;
          font-size: clamp(3rem, 9vw, 5rem);
          color: ${colors.neon};
          opacity: 0.85;
     }
`

/* ---------- Fikrlar ---------- */

export const ReviewStage = styled.figure`
     display: grid;
     gap: 1.5rem;
     max-width: 52rem;
     margin-top: clamp(2rem, 5vw, 3.5rem);
     min-height: 14rem;
`

/* Matn o'zgarganda silliq paydo bo'ladi; key o'zgargani uchun animatsiya qayta ishlaydi */
export const ReviewText = styled.blockquote`
     ${display};
     font-weight: 700;
     font-stretch: 105%;
     letter-spacing: -0.01em;
     line-height: 1.2;
     font-size: clamp(1.45rem, 3.8vw, 2.5rem);
     animation: ${fadeIn} 0.5s ease backwards;

     @media (prefers-reduced-motion: reduce) {
          animation: none;
     }
`

export const ReviewAuthor = styled.figcaption`
     display: flex;
     flex-wrap: wrap;
     gap: 0.25rem 0.75rem;
     align-items: baseline;
     animation: ${fadeIn} 0.5s ease backwards;

     strong {
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 110%;
          font-size: 1.1rem;
     }

     span {
          color: ${colors.steel};
     }

     @media (prefers-reduced-motion: reduce) {
          animation: none;
     }
`

export const ReviewControls = styled.div`
     display: flex;
     align-items: center;
     gap: 0.75rem;
     margin-top: 1.5rem;
`

export const ReviewButton = styled.button`
     display: inline-grid;
     place-items: center;
     width: 48px;
     height: 48px;
     border: 1px solid ${colors.neon};
     border-radius: ${layout.radius};
     background: transparent;
     cursor: pointer;
     transition: background-color 0.2s ease, color 0.2s ease;

     &:hover {
          background: ${colors.neon};
          color: ${colors.night};
     }

     /* strelka: CSS bilan chizilgan */
     &::before {
          content: "";
          width: 0.6rem;
          height: 0.6rem;
          border-left: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: translateX(2px) rotate(45deg);
     }

     &[data-dir="next"]::before {
          transform: translateX(-2px) rotate(225deg);
     }
`

export const Dots = styled.div`
     display: flex;
     gap: 0.1rem;
     margin-left: 0.5rem;
`

/* Nuqta kichik ko'rinadi, lekin bosiladigan joyi 44px */
export const Dot = styled.button`
     display: inline-grid;
     place-items: center;
     width: 28px;
     height: 44px;
     border: 0;
     background: transparent;
     cursor: pointer;

     &::before {
          content: "";
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          background: ${colors.steel};
          opacity: 0.4;
          transition: opacity 0.2s ease, background-color 0.2s ease;
     }

     &[aria-current="true"]::before {
          background: ${colors.neon};
          opacity: 1;
          box-shadow: 0 0 8px ${colors.neon};
     }
`

/* ---------- Manzil ---------- */

export const MapGrid = styled.div`
     display: grid;
     gap: 2rem;
     margin-top: clamp(2rem, 5vw, 3.5rem);

     ${media.desktop} {
          grid-template-columns: 5fr 7fr;
          gap: 4rem;
          align-items: stretch;
     }
`

export const MapInfo = styled.div`
     display: grid;
     align-content: start;
     gap: 1.5rem;
`

export const Address = styled.address`
     display: grid;
     gap: 0.2rem;
     font-style: normal;

     span:first-child {
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 110%;
          font-size: clamp(1.3rem, 3vw, 1.7rem);
          line-height: 1.2;
     }

     span:not(:first-child) {
          color: ${colors.steel};
     }
`

export const MapButtons = styled.div`
     display: flex;
     flex-wrap: wrap;
     gap: 0.75rem;
`

export const MapFrame = styled.div`
     overflow: hidden;
     min-height: 320px;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.deep};

     ${media.desktop} {
          min-height: 440px;
     }

     iframe {
          display: block;
          width: 100%;
          height: 100%;
          min-height: inherit;
          border: 0;
     }
`
