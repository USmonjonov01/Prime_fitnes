import styled, { css } from "styled-components"
import { colors, display, fonts, gradients, layout, media } from "../../../utils/theme"

const focusRing = css`
     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
     }
`

export const PageHead = styled.div`
     display: flex;
     align-items: baseline;
     justify-content: space-between;
     flex-wrap: wrap;
     gap: 0.5rem 1.5rem;
`

export const PageTitle = styled.h1`
     ${display};
     font-size: clamp(1.75rem, 4vw, 2.5rem);
`

export const DateText = styled.p`
     color: ${colors.steel};
`

export const SampleNote = styled.p`
     padding: 0.7rem 1rem;
     border-left: 3px solid ${colors.warn};
     background: rgba(245, 184, 61, 0.08);
     font-size: 0.9375rem;
`

/* Xodim va ega: kirishni belgilash, ko'rsatkichlar, ro'yxatlar */
export const Console = styled.section`
     display: grid;
     gap: 0.9rem;
     padding: clamp(1.25rem, 3vw, 2rem);
     border-radius: ${layout.radius};
     background: ${gradients.ticket};
`

export const ConsoleLabel = styled.h2`
     ${display};
     font-size: clamp(1.25rem, 3vw, 1.6rem);
`

export const ConsoleForm = styled.form`
     display: grid;
     grid-template-columns: minmax(0, 1fr);
     gap: 0.75rem;

     ${media.tablet} {
          grid-template-columns: minmax(0, 1fr) auto;
     }
`

export const CodeInput = styled.input`
     width: 100%;
     min-width: 0;
     min-height: 3.5rem;
     padding: 0 1rem;
     border: 2px solid rgba(234, 240, 255, 0.35);
     border-radius: ${layout.radius};
     background: rgba(5, 9, 24, 0.55);
     color: ${colors.floor};
     font: inherit;
     font-size: 1.35rem;
     font-weight: 700;
     letter-spacing: 0.04em;

     &::placeholder {
          color: rgba(234, 240, 255, 0.55);
          font-weight: 500;
          letter-spacing: 0;
     }

     &:focus-visible {
          outline: none;
          border-color: ${colors.floor};
          box-shadow: 0 0 0 3px rgba(141, 180, 255, 0.55);
     }
`

export const ConsoleSubmit = styled.button`
     display: inline-flex;
     align-items: center;
     justify-content: center;
     gap: 0.6rem;
     min-height: 3.5rem;
     padding: 0 1.75rem;
     border: 0;
     border-radius: ${layout.radius};
     background: ${colors.floor};
     color: ${colors.night};
     font-weight: 800;
     cursor: pointer;
     transition: background-color 0.15s ease;

     &:hover {
          background: #fff;
     }

     ${focusRing}
`

export const ConsoleHint = styled.p`
     color: rgba(234, 240, 255, 0.8);
     font-size: 0.9375rem;
`

export const Result = styled.p`
     padding: 0.75rem 1rem;
     border-radius: ${layout.radius};
     font-weight: 700;
     background: ${({ $tone }) => ($tone === "error" ? "rgba(255, 93, 93, 0.22)" : "rgba(47, 211, 140, 0.22)")};
     border-left: 4px solid ${({ $tone }) => ($tone === "error" ? colors.danger : colors.ok)};
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

export const Columns = styled.div`
     display: grid;
     gap: 2rem;

     ${media.desktop} {
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
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

export const List = styled.ul`
     list-style: none;
`

export const ListItem = styled.li`
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 1rem;
     padding: 0.85rem 0;
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
     }
`

export const Pill = styled.span`
     flex-shrink: 0;
     padding: 0.2rem 0.7rem;
     border: 1px solid ${colors.line};
     border-radius: 999px;
     font-size: 0.8125rem;
     font-weight: 600;
`

export const Actions = styled.div`
     display: flex;
     flex-wrap: wrap;
     gap: 0.75rem;
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

/* Kirim va chiqim diagrammasi (faqat ega). Kirim: yaxlit yashil chiziq, chiqim: uzuq qizil chiziq,
   shuning uchun ranglarni ajrata olmaganlarga ham farq ko'rinadi */
export const CashHead = styled.div`
     display: flex;
     flex-wrap: wrap;
     align-items: flex-end;
     justify-content: space-between;
     gap: 1rem 2rem;
     padding: 1rem 0;
`

export const CashSummary = styled.dl`
     display: flex;
     flex-wrap: wrap;
     gap: 0.75rem 2rem;

     div {
          display: grid;
          gap: 0.1rem;
     }

     dt {
          color: ${colors.steel};
          font-size: 0.9rem;
     }

     dd {
          font-family: ${fonts.heading};
          font-weight: 800;
          font-stretch: 115%;
          font-size: 1.35rem;
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
     }
`

// "Farq" qiymati: foyda bo'lsa yashil, zarar bo'lsa qizil

export const CashValue = styled.dd`
     color: ${({ $tone }) => $tone ?? colors.floor};
`

export const CashLegend = styled.ul`
     display: flex;
     gap: 1.25rem;
     list-style: none;
     color: ${colors.steel};
     font-size: 0.9rem;
`

export const LegendItem = styled.li`
     display: inline-flex;
     align-items: center;
     gap: 0.5rem;

     &::before {
          content: "";
          width: 1.5rem;
          border-top: 3px ${({ $dashed }) => ($dashed ? "dashed" : "solid")} ${({ $color }) => $color};
     }
`

export const ChartBox = styled.div`
     width: 100%;
     height: 17rem;
     min-width: 0;

     ${media.tablet} {
          height: 20rem;
     }

     /* recharts o'z matn rangini beradi, shuni brend ranglariga keltiramiz */
     .recharts-cartesian-axis-tick-value {
          fill: ${colors.steel};
          font-size: 0.8125rem;
     }
`

/* Modal: brauzerning o'z <dialog> elementi. Fokusni ushlab turish va Escape bilan yopish tayyor keladi */
export const Dialog = styled.dialog`
     width: min(30rem, calc(100vw - 2rem));
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
     }
`

export const DialogClose = styled.button`
     display: grid;
     place-items: center;
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

export const DialogInput = styled.input`
     ${fieldStyle}
`

export const DialogSelect = styled.select`
     ${fieldStyle}
`

export const DialogPrice = styled.p`
     display: flex;
     align-items: baseline;
     justify-content: space-between;
     gap: 1rem;
     padding: 0.8rem 0.9rem;
     border-left: 3px solid ${colors.neon};
     background: rgba(61, 99, 255, 0.14);

     strong {
          font-family: ${fonts.heading};
          font-weight: 800;
          font-stretch: 115%;
          font-size: 1.2rem;
          font-variant-numeric: tabular-nums;
     }
`

export const DialogActions = styled.div`
     display: flex;
     flex-wrap: wrap;
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
