import styled, { css } from "styled-components"
import { colors, display, fonts, layout, media } from "../../../utils/theme"

const focusRing = css`
     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
     }
`

export const PageHead = styled.div`
     display: flex;
     align-items: center;
     justify-content: space-between;
     flex-wrap: wrap;
     gap: 0.75rem 1.5rem;
`

export const PageTitle = styled.h1`
     ${display};
     font-size: clamp(1.75rem, 4vw, 2.5rem);
`

export const Figures = styled.dl`
     display: grid;
     grid-template-columns: 1fr 1fr;
     border-top: 1px solid ${colors.line};
     border-bottom: 1px solid ${colors.line};

     ${media.desktop} {
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          grid-template-columns: none;
     }
`

export const Figure = styled.div`
     display: grid;
     gap: 0.25rem;
     padding: 1.1rem 1rem;
     border-right: 1px solid ${colors.line};

     &:nth-child(2n) {
          border-right: 0;
     }

     &:nth-child(n + 3) {
          border-top: 1px solid ${colors.line};
     }

     ${media.desktop} {
          &:nth-child(2n) {
               border-right: 1px solid ${colors.line};
          }

          &:nth-child(n + 3) {
               border-top: 0;
          }

          &:last-child {
               border-right: 0;
          }
     }

     strong {
          font-family: ${fonts.heading};
          font-weight: 800;
          font-stretch: 115%;
          font-size: clamp(1.6rem, 3.5vw, 2.3rem);
          line-height: 1.1;
          color: ${({ $warn }) => ($warn ? colors.warn : colors.floor)};
     }

     span {
          color: ${colors.steel};
          font-size: 0.9375rem;
     }
`

export const Panel = styled.section`
     min-width: 0;
`

export const PanelTitle = styled.h2`
     ${display};
     font-size: 1.25rem;
     padding-bottom: 0.9rem;
     border-bottom: 1px solid ${colors.line};
`

export const Empty = styled.section`
     color: ${colors.steel};
     display: grid;
     gap: 0.6rem;
     padding: clamp(1.25rem, 3vw, 2rem);
     border: 1px dashed ${colors.line};
     border-radius: ${layout.radius};

     h2 {
          ${display};
          font-size: 1.5rem;
     }

     p {
          color: ${colors.steel};
     }
`

export const ActionButton = styled.button`
     display: inline-flex;
     align-items: center;
     gap: 0.6rem;
     min-height: 3rem;
     padding: 0 1.25rem;
     border: 1px solid ${colors.neon};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.floor};
     font-weight: 700;
     cursor: pointer;
     transition: background-color 0.15s ease, color 0.15s ease;

     &:hover {
          background: ${colors.neon};
          color: ${colors.night};
     }

     ${focusRing}
`

/* Qidiruv va saralash */
export const Toolbar = styled.div`
     display: grid;
     gap: 0.9rem;
     padding: 1rem 0;
`

export const SearchField = styled.div`
     display: grid;
`

// Ekranda ko'rinmaydi, lekin ekran o'qigichlar uchun yorliq
export const Hidden = styled.label`
     position: absolute;
     width: 1px;
     height: 1px;
     overflow: hidden;
     clip-path: inset(50%);
     white-space: nowrap;
`

const fieldStyle = css`
     width: 100%;
     min-height: 3rem;
     padding: 0 0.9rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.night};
     color: ${colors.floor};
     font: inherit;

     &:focus-visible {
          outline: none;
          border-color: ${colors.neon};
          box-shadow: 0 0 0 3px rgba(141, 180, 255, 0.35);
     }
`

export const SearchInput = styled.input`
     ${fieldStyle}
`

export const Filters = styled.div`
     display: flex;
     flex-wrap: wrap;
     gap: 0.5rem;
`

export const FilterButton = styled.button`
     display: inline-flex;
     align-items: center;
     gap: 0.5rem;
     min-height: 2.5rem;
     padding: 0 0.9rem;
     border: 1px solid ${({ $active }) => ($active ? colors.neon : colors.line)};
     border-radius: 999px;
     background: ${({ $active }) => ($active ? "rgba(61, 99, 255, 0.28)" : "transparent")};
     color: ${({ $active }) => ($active ? colors.floor : colors.steel)};
     font-weight: 600;
     cursor: pointer;

     &:hover {
          color: ${colors.floor};
          border-color: ${colors.neon};
     }

     span {
          font-variant-numeric: tabular-nums;
          opacity: 0.8;
     }

     ${focusRing}
`

export const Count = styled.p`
     color: ${colors.steel};
     font-size: 0.9375rem;
     padding-bottom: 0.5rem;
`

/* Mijozlar ro'yxati: har qator bitta tugma (bosilsa tafsilot ochiladi) */
export const Rows = styled.ul`
     list-style: none;
     border-top: 1px solid ${colors.line};
`

export const RowButton = styled.button`
     display: grid;
     grid-template-columns: minmax(0, 1fr) auto;
     align-items: center;
     gap: 0.4rem 1rem;
     width: 100%;
     padding: 0.9rem 0.25rem;
     border: 0;
     border-bottom: 1px solid ${colors.line};
     background: transparent;
     color: inherit;
     font: inherit;
     text-align: left;
     cursor: pointer;

     &:hover {
          background: rgba(141, 180, 255, 0.06);
     }

     ${media.tablet} {
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.3fr) auto;
          padding: 0.9rem 0.75rem;
     }

     ${focusRing}
`

export const RowMain = styled.span`
     display: grid;
     gap: 0.1rem;
     min-width: 0;

     strong {
          overflow-wrap: anywhere;
          line-height: 1.3;
     }

     small {
          color: ${colors.steel};
          font-size: 0.9rem;
     }
`

// Telefonda ikkinchi qatorga tushadi, planshetdan boshlab o'rtadagi ustun bo'ladi
export const RowPlan = styled.span`
     grid-column: 1 / -1;
     grid-row: 2;
     display: grid;
     gap: 0.1rem;
     min-width: 0;
     color: ${colors.steel};
     font-size: 0.9rem;

     ${media.tablet} {
          grid-column: auto;
          grid-row: auto;
     }
`

export const RowStatus = styled.span`
     grid-column: 2;
     grid-row: 1;

     ${media.tablet} {
          grid-column: auto;
          grid-row: auto;
     }
`

const TONES = {
     ok: colors.ok,
     warn: colors.warn,
     danger: colors.danger,
     neutral: colors.steel,
}

// Holat har doim matn bilan ham yoziladi, rang faqat qo'shimcha belgi
export const Status = styled.span`
     display: inline-block;
     flex-shrink: 0;
     padding: 0.2rem 0.7rem;
     border: 1px solid ${({ $tone }) => TONES[$tone] ?? colors.line};
     border-radius: 999px;
     color: ${({ $tone }) => TONES[$tone] ?? colors.floor};
     font-size: 0.8125rem;
     font-weight: 700;
     white-space: nowrap;
`

export const LoadMore = styled.div`
     display: flex;
     justify-content: center;
     padding-top: 1.25rem;
`

/* Modal: brauzerning o'z <dialog> elementi */
export const Dialog = styled.dialog`
     width: min(${({ $wide }) => ($wide ? "40rem" : "30rem")}, calc(100vw - 2rem));
     max-height: calc(100vh - 2rem);
     margin: auto;
     padding: 0;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.deep};
     color: ${colors.floor};
     overflow-y: auto;

     &::backdrop {
          background: rgba(5, 9, 24, 0.78);
     }

     &[open] {
          animation: dialog-rise 0.2s ease-out;
     }

     @keyframes dialog-rise {
          from {
               opacity: 0;
               transform: translateY(0.75rem);
          }
     }

     @media (prefers-reduced-motion: reduce) {
          &[open] {
               animation: none;
          }
     }
`

export const DialogHead = styled.div`
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 1rem;
     padding: 1.1rem 1.25rem;
     border-bottom: 1px solid ${colors.line};

     h2 {
          ${display};
          font-size: 1.3rem;
          overflow-wrap: anywhere;
     }
`

export const DialogClose = styled.button`
     display: grid;
     place-items: center;
     flex-shrink: 0;
     width: 2.5rem;
     height: 2.5rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.steel};
     cursor: pointer;

     &:hover {
          color: ${colors.floor};
          border-color: ${colors.neon};
     }

     ${focusRing}
`

export const DialogForm = styled.form`
     display: grid;
     gap: 1.1rem;
     padding: 1.25rem;
`

export const DialogField = styled.div`
     display: grid;
     gap: 0.4rem;

     label {
          font-weight: 600;
     }

     small {
          color: ${colors.steel};
          font-size: 0.875rem;
     }
`

export const DialogInput = styled.input`
     ${fieldStyle}
`

export const DialogActions = styled.div`
     display: flex;
     flex-wrap: wrap;
     align-items: center;
     justify-content: flex-end;
     gap: 0.75rem;
     padding-top: 0.25rem;
`

export const DialogCancel = styled.button`
     min-height: 3rem;
     padding: 0 1.25rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.steel};
     font-weight: 600;
     cursor: pointer;

     &:hover {
          color: ${colors.floor};
          border-color: ${colors.steel};
     }

     ${focusRing}
`

export const DialogSubmit = styled.button`
     min-height: 3rem;
     padding: 0 1.5rem;
     border: 0;
     border-radius: ${layout.radius};
     background: ${colors.electric};
     color: #fff;
     font-weight: 800;
     cursor: pointer;
     transition: background-color 0.15s ease;

     &:hover {
          background: ${colors.electricHover};
     }

     ${focusRing}
`

export const DangerButton = styled.button`
     min-height: 3rem;
     padding: 0 1.25rem;
     border: 1px solid ${colors.danger};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.danger};
     font-weight: 700;
     cursor: pointer;
     transition: background-color 0.15s ease, color 0.15s ease;

     &:hover {
          background: ${colors.danger};
          color: ${colors.night};
     }

     ${focusRing}
`

export const ConfirmText = styled.p`
     flex: 1 1 14rem;
     color: ${colors.floor};
     font-weight: 600;
`

/* Mijoz tafsiloti */
export const DetailBody = styled.div`
     display: grid;
     gap: 1.25rem;
     padding: 1.25rem;
`

export const DetailList = styled.dl`
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 1rem 1.5rem;

     ${media.tablet} {
          grid-template-columns: repeat(3, 1fr);
     }

     div {
          display: grid;
          gap: 0.2rem;
          align-content: start;
     }

     dt {
          color: ${colors.steel};
          font-size: 0.875rem;
     }

     dd {
          font-weight: 700;
          overflow-wrap: anywhere;
     }
`

export const SubTitle = styled.h3`
     ${display};
     font-size: 1.05rem;
     padding-bottom: 0.6rem;
     border-bottom: 1px solid ${colors.line};
`

export const Sheet = styled.ul`
     list-style: none;
`

export const SheetItem = styled.li`
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 1rem;
     padding: 0.7rem 0;
     border-bottom: 1px solid ${colors.line};

     strong,
     span {
          display: block;
          line-height: 1.35;
     }

     span {
          color: ${colors.steel};
          font-size: 0.9rem;
     }

     time {
          color: ${colors.neon};
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          text-align: right;
     }
`

export const Muted = styled.p`
     color: ${colors.steel};
`