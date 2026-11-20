import styled, { css, keyframes } from "styled-components"
import { colors, display, fonts, gradients, layout, media } from "../../utils/theme"

/* ---------- Umumiy ---------- */

const reveal = keyframes`
     from { clip-path: inset(0 100% 0 0); }
`

const fadeIn = keyframes`
     from { opacity: 0; }
`

export const Wrap = styled.div`
     width: 100%;
     max-width: ${layout.maxWidth};
     margin: 0 auto;
     padding: 0 ${layout.gutter};
`

export const Section = styled.section`
     padding: clamp(4.5rem, 10vw, 8rem) 0;
     scroll-margin-top: ${layout.navHeight};
`

export const SectionTitle = styled.h2`
     ${display};
     font-stretch: 115%;
     font-size: clamp(2rem, 5vw, 3.5rem);
`

const buttonBase = css`
     display: inline-flex;
     align-items: center;
     justify-content: center;
     min-height: 52px;
     padding: 0.85rem 1.7rem;
     border-radius: ${layout.radius};
     font-weight: 700;
     font-size: 1.02rem;
     text-decoration: none;
     transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
`

export const PrimaryButton = styled.a`
     ${buttonBase};
     background: ${colors.electric};
     color: #fff;

     &:hover {
          background: ${colors.electricHover};
     }
`

export const GhostButton = styled.a`
     ${buttonBase};
     border: 1px solid ${colors.neon};
     color: ${colors.floor};

     &:hover {
          background: ${colors.neon};
          color: ${colors.night};
     }
`

/* ---------- Hero ---------- */

export const Hero = styled.header`
     position: relative;
     display: flex;
     align-items: flex-end;
     min-height: 100vh;
     min-height: 100svh;
     padding: calc(${layout.navHeight} + 2rem) 0 clamp(3rem, 8vw, 6rem);
     background: ${gradients.hall};
     overflow: hidden;
`

/* LED chiziqdan devorga tushgan nur */
export const Wash = styled.div`
     position: absolute;
     inset: 0;
     /* pastki qism sahifa foniga (night) silliq o'tadi, bo'limlar orasida chok qolmaydi */
     background:
          linear-gradient(0deg, ${colors.night} 0%, rgba(5, 9, 24, 0) 32%),
          ${gradients.wash};
     pointer-events: none;
`

/* Shiftdagi neon chiziq: sahifadagi yagona harakat, bir marta chapdan o'ngga chiziladi */
export const Beam = styled.svg`
     position: absolute;
     inset: 0;
     width: 100%;
     height: 100%;
     pointer-events: none;
     filter: drop-shadow(0 0 5px ${colors.neon}) drop-shadow(0 0 22px ${colors.electric});
     animation: ${reveal} 1.7s cubic-bezier(0.65, 0, 0.2, 1) 0.15s backwards;

     path {
          fill: none;
          stroke: #D6E4FF;
          stroke-width: 3;
     }

     @media (prefers-reduced-motion: reduce) {
          animation: none;
     }
`

export const HeroInner = styled(Wrap)`
     position: relative;
     animation: ${fadeIn} 0.9s ease 1.1s backwards;

     @media (prefers-reduced-motion: reduce) {
          animation: none;
     }
`

export const Title = styled.h1`
     ${display};
     font-size: clamp(3rem, 12.5vw, 10.5rem);
     line-height: 0.9;
     letter-spacing: -0.035em;
`

export const Lead = styled.p`
     max-width: 34rem;
     margin-top: 1.5rem;
     color: ${colors.steel};
     font-size: clamp(1.05rem, 2vw, 1.25rem);
`

export const Actions = styled.div`
     display: flex;
     flex-wrap: wrap;
     gap: 0.85rem;
     margin-top: 2rem;
`

/* ---------- Zalda nima bor ---------- */

export const Split = styled.div`
     display: grid;
     gap: 2.5rem;

     ${media.desktop} {
          grid-template-columns: 5fr 7fr;
          gap: 5rem;
          align-items: start;
     }
`

export const Intro = styled.p`
     max-width: 26rem;
     margin-top: 1.25rem;
     color: ${colors.steel};
`

export const Rows = styled.ul`
     list-style: none;
     border-top: 1px solid ${colors.line};
`

export const Row = styled.li`
     display: grid;
     gap: 0.35rem;
     padding: 1.5rem 0;
     border-bottom: 1px solid ${colors.line};

     ${media.tablet} {
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          align-items: baseline;
     }

     h3 {
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 110%;
          font-size: clamp(1.2rem, 2.4vw, 1.5rem);
          line-height: 1.2;
     }

     p {
          color: ${colors.steel};
     }
`

/* ---------- Narxlar ---------- */

export const PricingSection = styled(Section)`
     background: ${colors.deep};
     border-top: 1px solid ${colors.line};
     border-bottom: 1px solid ${colors.line};
`

export const Tickets = styled.div`
     display: grid;
     /* ochilgan ticket qo'shnisini cho'zib yubormasligi uchun */
     align-items: start;
     gap: 1.25rem;
     margin-top: clamp(2rem, 5vw, 3.5rem);

     ${media.tablet} {
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
     }

     ${media.desktop} {
          grid-template-columns: repeat(3, 1fr);
     }
`

export const Ticket = styled.article`
     position: relative;
     z-index: 0;
     display: flex;
     flex-direction: column;
     overflow: hidden;
     background: ${colors.deep};
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     transition: box-shadow 0.35s ease, border-color 0.35s ease;

     ${({ $featured }) => $featured && css`
          background: ${gradients.ticket};
          border-color: rgba(141, 180, 255, 0.45);
     `}

     /* Ochiq ticket qo'shnilardan yuqorida turadi va soya tashlaydi */
     ${({ $open }) => $open && css`
          z-index: 2;
          border-color: ${colors.neon};
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(141, 180, 255, 0.25);
     `}

     @media (prefers-reduced-motion: reduce) {
          transition: none;
     }
`

/* Balandlik animatsiyasi: grid qatori 0fr dan 1fr ga o'tadi, balandlikni JS bilan o'lchash kerak emas */
export const TicketMore = styled.div`
     display: grid;
     grid-template-rows: 0fr;
     visibility: hidden;
     transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s linear 0.4s;

     ${({ $open }) => $open && css`
          grid-template-rows: 1fr;
          visibility: visible;
          transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s;
     `}

     @media (prefers-reduced-motion: reduce) {
          transition: none;
     }
`

export const TicketMoreInner = styled.div`
     min-height: 0;
     overflow: hidden;
`

export const Includes = styled.ul`
     list-style: none;
     display: grid;
     gap: 0.75rem;
     padding: 0 1.5rem 1.6rem;

     li {
          position: relative;
          padding-left: 1.7rem;
          color: ${colors.floor};
     }

     /* belgi: CSS bilan chizilgan tasdiq belgisi */
     li::before {
          content: "";
          position: absolute;
          left: 0.2rem;
          top: 0.42em;
          width: 0.5rem;
          height: 0.9rem;
          border-right: 2px solid ${colors.neon};
          border-bottom: 2px solid ${colors.neon};
          transform: rotate(40deg) scale(0.8);
          transform-origin: center;
     }
`

export const TicketToggle = styled.button`
     display: flex;
     align-items: center;
     justify-content: space-between;
     width: 100%;
     padding: 1rem 1.5rem;
     border: 0;
     border-top: 1px solid ${colors.line};
     background: transparent;
     font-weight: 700;
     text-align: left;
     cursor: pointer;
     transition: background-color 0.2s ease;

     &:hover {
          background: rgba(141, 180, 255, 0.1);
     }

     ${({ $featured }) => $featured && css`
          border-top-color: rgba(234, 240, 255, 0.25);
     `}

     /* strelka: ochilganda aylanadi */
     &::after {
          content: "";
          width: 0.55rem;
          height: 0.55rem;
          margin-right: 0.2rem;
          border-right: 2px solid ${colors.neon};
          border-bottom: 2px solid ${colors.neon};
          transform: translateY(-2px) rotate(45deg);
          transition: transform 0.35s ease;
     }

     ${({ $open }) => $open && css`
          &::after {
               transform: translateY(2px) rotate(225deg);
          }
     `}

     @media (prefers-reduced-motion: reduce) {
          &::after {
               transition: none;
          }
     }
`

/* ---------- Zal rasmlari ---------- */

export const Gallery = styled.div`
     display: grid;
     gap: 1rem;
     margin-top: clamp(2rem, 5vw, 3.5rem);

     ${media.tablet} {
          grid-template-columns: 7fr 5fr;
          grid-template-rows: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
          height: clamp(380px, 46vw, 620px);
     }
`

export const Photo = styled.figure`
     position: relative;
     overflow: hidden;
     aspect-ratio: 4 / 3;
     border-radius: ${layout.radius};
     background: ${colors.deep};

     ${media.tablet} {
          aspect-ratio: auto;

          &:first-child {
               grid-row: span 2;
          }
     }

     img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
     }

     /* Rasm hali qo'yilmagan joy */
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

export const TicketTop = styled.div`
     padding: 1.5rem 1.5rem 1.4rem;

     h3 {
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 112%;
          font-size: 1.35rem;
          line-height: 1.2;
     }

     p {
          margin-top: 0.3rem;
          color: ${colors.steel};
     }

     ${({ $featured }) => $featured && css`
          p {
               color: ${colors.floor};
          }
     `}
`

/* Punktir chiziq: qog'oz abonement kartasidagi uzilish chizig'iga ishora */
export const TicketBottom = styled.div`
     display: flex;
     align-items: baseline;
     gap: 0.6rem;
     padding: 1.5rem 1.5rem 1.7rem;
     border-top: 2px dashed ${colors.line};

     ${({ $featured }) => $featured && css`
          border-top-color: rgba(234, 240, 255, 0.4);
     `}
`

export const Amount = styled.span`
     ${display};
     font-size: clamp(2.6rem, 6vw, 3.8rem);
`

export const Currency = styled.span`
     color: ${colors.steel};
     font-weight: 600;

     ${({ $featured }) => $featured && css`
          color: ${colors.floor};
     `}
`

/* ---------- Aloqa ---------- */

export const ContactSection = styled(Section)`
     background: ${gradients.band};
`

export const PhoneLink = styled.a`
     ${display};
     display: inline-block;
     margin-top: 1.5rem;
     font-size: clamp(1.9rem, 6.4vw, 4.2rem);
     text-decoration: none;
     overflow-wrap: anywhere;

     &:hover {
          text-decoration: underline;
          text-decoration-thickness: 3px;
          text-underline-offset: 0.12em;
     }
`

export const Details = styled.div`
     display: grid;
     gap: 1.5rem;
     margin-top: 2.5rem;

     ${media.tablet} {
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 46rem;
     }

     h3 {
          font-family: ${fonts.heading};
          font-weight: 700;
          font-stretch: 110%;
          font-size: 1.1rem;
          margin-bottom: 0.35rem;
     }

     p,
     a {
          color: ${colors.floor};
     }
`

/* ---------- Hero orqa fon videolari ---------- */

/* Videolar yuklanguncha (yoki o'chirilgan bo'lsa) Hero'ning o'z zal gradienti ko'rinib turadi */
export const HeroMedia = styled.div`
     position: absolute;
     inset: 0;
     overflow: hidden;
     pointer-events: none;
`

/* Videolar tik (portret) formatda, shuning uchun keng ekranda o'rtadagi gorizontal qismi ko'rinadi */
export const HeroVideo = styled.video`
     position: absolute;
     inset: 0;
     width: 100%;
     height: 100%;
     object-fit: cover;
     object-position: 50% 38%;
     opacity: 0;
     transition: opacity 1.1s ease;

     ${({ $active }) => $active && css`
          opacity: 1;
     `}

     @media (prefers-reduced-motion: reduce) {
          transition: none;
     }
`

/* Ko'k nur video ustida qoladi. "screen" aralashmasi qorong'i kadrni ko'k nur bilan yoritadi,
   videoning o'zi esa ko'rinib turadi (oddiy qoplama videoni yopib qo'yardi) */
export const HeroTint = styled.div`
     position: absolute;
     inset: 0;
     pointer-events: none;
     mix-blend-mode: screen;
     background:
          radial-gradient(70% 55% at 28% 30%, rgba(88, 119, 255, 0.5) 0%, rgba(88, 119, 255, 0) 70%),
          radial-gradient(120% 75% at 28% 38%, rgba(27, 59, 232, 0.85) 0%, rgba(17, 37, 148, 0.55) 38%, rgba(8, 17, 58, 0.28) 66%, rgba(5, 9, 24, 0) 100%);
`

/* Sarlavha va tugmalar har qanday kadrda o'qilishi uchun matn turgan tomonni qoraytiradi:
   telefonda pastdan, keng ekranda chapdan */
export const HeroScrim = styled.div`
     position: absolute;
     inset: 0;
     pointer-events: none;
     background: linear-gradient(0deg, rgba(5, 9, 24, 0.85) 0%, rgba(5, 9, 24, 0.6) 42%, rgba(5, 9, 24, 0.1) 78%);

     ${media.tablet} {
          background: linear-gradient(75deg, rgba(5, 9, 24, 0.72) 0%, rgba(5, 9, 24, 0.35) 45%, rgba(5, 9, 24, 0) 75%);
     }
`