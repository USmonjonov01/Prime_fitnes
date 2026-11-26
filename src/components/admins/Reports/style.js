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
          font-size: clamp(1.4rem, 3.2vw, 2.1rem);
          line-height: 1.1;
          overflow-wrap: anywhere;
          font-variant-numeric: tabular-nums;
          color: ${({ $tone }) => $tone ?? colors.floor};
     }

     span {
          color: ${colors.steel};
          font-size: 0.9375rem;
     }
`

export const Panel = styled.section`
     display: grid;
     gap: 1rem;
     align-content: start;
     min-width: 0;
`

export const PanelTitle = styled.h2`
     ${display};
     font-size: 1.25rem;
     padding-bottom: 0.9rem;
     border-bottom: 1px solid ${colors.line};
`

export const Hint = styled.p`
     color: ${colors.steel};
     font-size: 0.9rem;
`

export const Note = styled.p`
     padding: 0.7rem 1rem;
     border-left: 3px solid ${colors.warn};
     background: rgba(245, 184, 61, 0.08);
     font-size: 0.9375rem;
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

/* Davr tanlash: 6 yoki 12 oy */
export const Segmented = styled.div`
     display: inline-flex;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     overflow: hidden;
`

export const SegmentButton = styled.button`
     min-height: 2.75rem;
     padding: 0 1.1rem;
     border: 0;
     background: ${({ $active }) => ($active ? colors.electric : "transparent")};
     color: ${({ $active }) => ($active ? "#fff" : colors.steel)};
     font-weight: 700;
     cursor: pointer;

     &:hover {
          color: #fff;
     }

     ${focusRing}
`

/* Diagrammalar */
export const ChartBox = styled.div`
     width: 100%;
     height: ${({ $short }) => ($short ? "15rem" : "17rem")};
     min-width: 0;

     ${media.tablet} {
          height: ${({ $short }) => ($short ? "17rem" : "21rem")};
     }

     /* recharts o'z matn rangini beradi, shuni brend ranglariga keltiramiz */
     .recharts-cartesian-axis-tick-value {
          fill: ${colors.steel};
          font-size: 0.8125rem;
     }
`

export const Legend = styled.ul`
     display: flex;
     flex-wrap: wrap;
     gap: 0.5rem 1.25rem;
     list-style: none;
     color: ${colors.steel};
     font-size: 0.9rem;
`

// $kind: bar (to'rtburchak), line (yaxlit chiziq), dashed (uzuq chiziq): rangni ajrata olmaganlarga ham farq ko'rinadi
export const LegendItem = styled.li`
     display: inline-flex;
     align-items: center;
     gap: 0.5rem;

     &::before {
          content: "";
          ${({ $kind, $color }) => ($kind === "bar"
               ? css`width: 0.85rem; height: 0.85rem; border-radius: 2px; background: ${$color};`
               : css`width: 1.5rem; border-top: 3px ${$kind === "dashed" ? "dashed" : "solid"} ${$color};`)}
     }
`

/* Foyda va zarar jadvali */
export const TableWrap = styled.div`
     overflow-x: auto;
     border-top: 1px solid ${colors.line};

     ${focusRing}
`

export const Table = styled.table`
     width: 100%;
     min-width: 28rem;
     border-collapse: collapse;
     font-variant-numeric: tabular-nums;

     caption {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
     }

     th,
     td {
          padding: 0.8rem 0.75rem;
          border-bottom: 1px solid ${colors.line};
          text-align: right;
          white-space: nowrap;
     }

     th:first-child,
     td:first-child {
          text-align: left;
     }

     thead th {
          color: ${colors.steel};
          font-size: 0.875rem;
          font-weight: 600;
     }

     tbody th {
          font-weight: 600;
     }

     tfoot th,
     tfoot td {
          font-family: ${fonts.heading};
          font-weight: 800;
          border-bottom: 0;
          border-top: 2px solid ${colors.line};
     }
`

// Foyda yashil, zarar qizil; matnda ham "+" va "−" belgisi bor
export const Profit = styled.span`
     color: ${({ $tone }) => $tone ?? colors.floor};
     font-weight: 700;
`

/* Abonementlar sotuvi: diagramma ostidagi qisqa ro'yxat */
export const Ranking = styled.ol`
     list-style: none;
     counter-reset: place;
`

export const RankingItem = styled.li`
     counter-increment: place;
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 1rem;
     padding: 0.7rem 0;
     border-bottom: 1px solid ${colors.line};

     strong::before {
          content: counter(place) ". ";
          color: ${colors.steel};
          font-variant-numeric: tabular-nums;
     }

     span {
          color: ${colors.steel};
          font-size: 0.9rem;
          font-variant-numeric: tabular-nums;
          text-align: right;
     }
`
/* Chiqim qo'shish oynasi: Bosh paneldagi modal bilan bir xil ko'rinadi */
export {
     Dialog, DialogActions, DialogCancel, DialogClose, DialogField, DialogForm, DialogHead, DialogInput, DialogSelect, DialogSubmit,
} from "../Dashboard/style"
export { DangerButton } from "../Customers/style"

export const RowAction = styled.button`
     min-height: 2.25rem;
     padding: 0 0.8rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.steel};
     font: inherit;
     font-size: 0.875rem;
     cursor: pointer;

     &:hover {
          color: ${colors.danger};
          border-color: ${colors.danger};
     }

     ${focusRing}
`

export const PanelHead = styled.div`
     display: flex;
     flex-wrap: wrap;
     align-items: center;
     justify-content: space-between;
     gap: 0.75rem 1rem;
     padding-bottom: 0.9rem;
     border-bottom: 1px solid ${colors.line};

     h2 {
          ${display};
          font-size: 1.25rem;
     }
`
