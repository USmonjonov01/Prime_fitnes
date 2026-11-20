import styled, { css, keyframes } from "styled-components"
import { colors, display, fonts, gradients, layout, media } from "../../utils/theme"
import { Wrap } from "../Home/style"

// Umumiy bloklar (Wrap, Section, tugmalar, Intro, aloqa bandi) Home/style.js dan olinadi.

const fadeIn = keyframes`
     from { opacity: 0; }
`

const draw = keyframes`
     from { clip-path: inset(0 100% 0 0); }
`

/* ---------- Sahifa boshi ---------- */

/* Yorug'lik o'ng tomondan tushadi (About'da chapdan edi), pastda LED chiziq bir marta chiziladi */
export const PageHero = styled.header`
     position: relative;
     overflow: hidden;
     padding: calc(${layout.navHeight} + clamp(2.5rem, 6vw, 4.5rem)) 0 clamp(3rem, 7vw, 5rem);
     background:
          radial-gradient(75% 130% at 100% 0%, rgba(27, 59, 232, 0.55) 0%, rgba(10, 18, 48, 0) 62%),
          ${colors.deep};

     &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: ${colors.neon};
          box-shadow: 0 0 8px ${colors.neon}, 0 0 20px ${colors.electric};
          animation: ${draw} 1.3s cubic-bezier(0.65, 0, 0.2, 1) 0.15s backwards;
     }

     @media (prefers-reduced-motion: reduce) {
          &::after {
               animation: none;
          }
     }
`

export const HeroInner = styled(Wrap)`
     animation: ${fadeIn} 0.7s ease backwards;

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

/* Sahifa ichidagi bo'limlarga tez o'tish */
export const HeroLinks = styled.div`
     display: flex;
     flex-wrap: wrap;
     gap: 0.85rem;
     margin-top: 2rem;
`

/* ---------- Bo'limlar ---------- */

export const Block = styled.section`
     padding: clamp(4rem, 9vw, 7rem) 0;
     scroll-margin-top: ${layout.navHeight};
`

export const AltBlock = styled(Block)`
     background: ${colors.deep};
     border-top: 1px solid ${colors.line};
     border-bottom: 1px solid ${colors.line};
`

export const Head = styled.div`
     display: grid;
     gap: 1rem;
     margin-bottom: clamp(2rem, 5vw, 3.5rem);
`

export const Note = styled.p`
     color: ${colors.steel};
     font-size: 0.95rem;
`

/* Tasdiqlanmagan ma'lumot haqida izoh */
export const Warn = styled.p`
     margin-top: 0.75rem;
     color: ${colors.warn};
     font-size: 0.92rem;
`

/* ---------- Abonement panellari ---------- */

export const Plans = styled.div`
     display: grid;
     align-items: start;
     gap: 1.25rem;

     ${media.tablet} {
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
     }
`

/* Tikka kartochka o'rniga "jihoz plastinkasi": nom, katta narx, ostida chiziqli xususiyatlar */
export const Plan = styled.article`
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.deep};

     ${({ $featured }) => $featured && css`
          background: ${gradients.ticket};
          border-color: rgba(141, 180, 255, 0.5);
     `}
`

export const PlanHead = styled.div`
     padding: 1.6rem 1.5rem 1.4rem;

     h3 {
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 112%;
          font-size: 1.35rem;
          line-height: 1.2;
     }
`

export const PlanPrice = styled.p`
     display: flex;
     align-items: baseline;
     gap: 0.6rem;
     margin-top: 0.9rem;

     strong {
          ${display};
          font-size: clamp(2.6rem, 6vw, 3.6rem);
     }

     span {
          font-weight: 600;
          color: ${colors.steel};
     }
`

export const PlanRows = styled.dl`
     border-top: 1px solid ${colors.line};
`

export const PlanRow = styled.div`
     display: grid;
     gap: 0.2rem;
     padding: 1rem 1.5rem;
     border-bottom: 1px solid ${colors.line};

     &:last-child {
          border-bottom: 0;
     }

     dt {
          color: ${colors.steel};
          font-size: 0.95rem;
     }

     dd {
          font-weight: 600;
     }

     ${({ $featured }) => $featured && css`
          border-bottom-color: rgba(234, 240, 255, 0.22);

          dt {
               color: ${colors.floor};
          }
     `}
`

/* ---------- Hisoblagich ---------- */

export const Calc = styled.section`
     margin-top: clamp(2.5rem, 6vw, 4rem);
     padding: clamp(1.5rem, 4vw, 2.5rem);
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: rgba(5, 9, 24, 0.55);
`

export const CalcTitle = styled.h3`
     font-family: ${fonts.heading};
     font-weight: 800;
     font-stretch: 112%;
     font-size: clamp(1.3rem, 3vw, 1.8rem);
     line-height: 1.15;
`

export const CalcLabel = styled.label`
     display: flex;
     align-items: baseline;
     justify-content: space-between;
     gap: 1rem;
     margin-top: 1.75rem;
     font-weight: 600;

     output {
          flex: none;
          white-space: nowrap;
          ${display};
          font-stretch: 112%;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          color: ${colors.neon};
     }
`

/* Surgich: to'ldirilgan qismi --fill orqali beriladi */
export const Slider = styled.input`
     --fill: 0%;
     display: block;
     width: 100%;
     height: 44px;
     margin: 0.5rem 0 0;
     background: transparent;
     cursor: pointer;
     -webkit-appearance: none;
     appearance: none;

     &::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, ${colors.neon} var(--fill), rgba(141, 180, 255, 0.22) var(--fill));
     }

     &::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, ${colors.neon} var(--fill), rgba(141, 180, 255, 0.22) var(--fill));
     }

     &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          margin-top: -10px;
          border: 3px solid ${colors.night};
          border-radius: 50%;
          background: ${colors.neon};
          box-shadow: 0 0 10px ${colors.neon}, 0 0 22px ${colors.electric};
     }

     &::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: 3px solid ${colors.night};
          border-radius: 50%;
          background: ${colors.neon};
          box-shadow: 0 0 10px ${colors.neon}, 0 0 22px ${colors.electric};
     }
`

export const SliderScale = styled.div`
     display: flex;
     justify-content: space-between;
     color: ${colors.steel};
     font-size: 0.9rem;
`

export const Bars = styled.div`
     display: grid;
     gap: 1.25rem;
     margin-top: 2rem;
`

export const BarHead = styled.div`
     display: flex;
     flex-wrap: wrap;
     align-items: baseline;
     justify-content: space-between;
     gap: 0.25rem 1rem;
     margin-bottom: 0.5rem;

     span {
          color: ${colors.steel};
     }

     strong {
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 108%;
          font-size: 1.15rem;
     }
`

export const Best = styled.em`
     margin-left: 0.6rem;
     padding: 0.1rem 0.55rem;
     border: 1px solid ${colors.ok};
     border-radius: 999px;
     color: ${colors.ok};
     font-style: normal;
     font-size: 0.82rem;
     font-weight: 700;
`

export const BarTrack = styled.div`
     height: 14px;
     border-radius: 3px;
     background: rgba(141, 180, 255, 0.12);
     overflow: hidden;
`

export const BarFill = styled.div`
     height: 100%;
     border-radius: 3px;
     background: ${colors.electric};
     transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);

     ${({ $best }) => $best && css`
          background: ${colors.neon};
          box-shadow: 0 0 12px ${colors.neon};
     `}

     @media (prefers-reduced-motion: reduce) {
          transition: none;
     }
`

export const Verdict = styled.p`
     margin-top: 1.75rem;
     padding-top: 1.25rem;
     border-top: 1px solid ${colors.line};
     font-family: ${fonts.heading};
     font-weight: 700;
     font-stretch: 108%;
     font-size: clamp(1.15rem, 2.6vw, 1.5rem);
     line-height: 1.25;
`

/* ---------- Zalda nima qilish mumkin ---------- */

export const Zones = styled.ul`
     list-style: none;
     border-top: 1px solid ${colors.line};
`

export const Zone = styled.li`
     display: grid;
     grid-template-columns: auto 1fr;
     gap: 0.5rem 1.5rem;
     align-items: center;
     padding: clamp(1.5rem, 3.5vw, 2.25rem) 0;
     border-bottom: 1px solid ${colors.line};

     ${media.tablet} {
          grid-template-columns: auto 1fr 1fr;
          gap: 2.5rem;
     }

     /* piktogramma */
     svg {
          display: block;
          width: clamp(48px, 9vw, 72px);
          height: auto;
          color: ${colors.neon};
          filter: drop-shadow(0 0 6px rgba(141, 180, 255, 0.55));
     }

     h3 {
          font-family: ${fonts.heading};
          font-weight: 800;
          font-stretch: 112%;
          font-size: clamp(1.25rem, 3vw, 2rem);
          line-height: 1.1;
          letter-spacing: -0.015em;
     }

     p {
          grid-column: 2;
          max-width: 28rem;
          color: ${colors.steel};

          ${media.tablet} {
               grid-column: auto;
          }
     }
`

/* ---------- Savol-javob ---------- */

export const Faq = styled.ul`
     list-style: none;
     max-width: 52rem;
     border-top: 1px solid ${colors.line};
`

export const FaqItem = styled.li`
     border-bottom: 1px solid ${colors.line};
`

export const FaqQuestion = styled.button`
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 1.5rem;
     width: 100%;
     min-height: 64px;
     padding: 1.1rem 0;
     border: 0;
     background: transparent;
     font-family: ${fonts.heading};
     font-weight: 700;
     font-stretch: 108%;
     font-size: clamp(1.05rem, 2.2vw, 1.3rem);
     line-height: 1.25;
     text-align: left;
     cursor: pointer;
     transition: color 0.2s ease;

     &:hover {
          color: ${colors.neon};
     }

     /* + belgisi: ochilganda x ga aylanadi */
     &::after {
          content: "";
          flex: none;
          width: 0.8rem;
          height: 0.8rem;
          background:
               linear-gradient(${colors.neon}, ${colors.neon}) center / 100% 2px no-repeat,
               linear-gradient(${colors.neon}, ${colors.neon}) center / 2px 100% no-repeat;
          transition: transform 0.3s ease;
     }

     ${({ $open }) => $open && css`
          &::after {
               transform: rotate(45deg);
          }
     `}

     @media (prefers-reduced-motion: reduce) {
          &::after {
               transition: none;
          }
     }
`

/* Balandlik animatsiyasi Home'dagi ticket bilan bir xil usulda: grid qatori 0fr dan 1fr ga */
export const FaqAnswer = styled.div`
     display: grid;
     grid-template-rows: 0fr;
     visibility: hidden;
     transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s linear 0.35s;

     ${({ $open }) => $open && css`
          grid-template-rows: 1fr;
          visibility: visible;
          transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s;
     `}

     > div {
          min-height: 0;
          overflow: hidden;
     }

     p {
          max-width: 40rem;
          padding-bottom: 1.4rem;
          color: ${colors.steel};
     }

     a {
          color: ${colors.floor};
          text-decoration-color: ${colors.neon};
          text-underline-offset: 0.2em;
     }

     @media (prefers-reduced-motion: reduce) {
          transition: none;
     }
`
