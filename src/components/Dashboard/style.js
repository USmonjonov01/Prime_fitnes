import styled, { css } from "styled-components"
import { colors, display, fonts, gradients, layout, media } from "../../utils/theme"

const SIDEBAR = "16rem"
const TABBAR = "4.25rem"
const focusRing = css`
     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
     }
`

/* Karkas: xodim va egada telefonda tepada panel + ochiladigan menyu, mijozda pastki tab panel.
   Kompyuterda hammasida doimiy chap menyu */
export const Shell = styled.div`
     min-height: 100vh;
     background: ${colors.night};

     ${media.desktop} {
          display: grid;
          grid-template-columns: ${SIDEBAR} minmax(0, 1fr);
     }
`

export const Topbar = styled.header`
     position: sticky;
     top: 0;
     z-index: 20;
     display: flex;
     align-items: center;
     gap: 0.75rem;
     height: 3.5rem;
     padding: 0 1rem;
     background: ${colors.deep};
     border-bottom: 1px solid ${colors.line};

     ${media.desktop} {
          display: none;
     }
`

export const MenuButton = styled.button`
     display: grid;
     place-items: center;
     width: 2.5rem;
     height: 2.5rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.floor};
     cursor: pointer;
     ${focusRing}
`

export const Backdrop = styled.button`
     position: fixed;
     inset: 0;
     z-index: 30;
     border: 0;
     background: rgba(5, 9, 24, 0.7);
     cursor: default;

     ${media.desktop} {
          display: none;
     }
`

export const Brand = styled.div`
     font-family: ${fonts.heading};
     font-weight: 800;
     font-stretch: 125%;
     font-size: 1.15rem;
     letter-spacing: 0.02em;

     span {
          color: ${colors.neon};
     }
`

export const Sidebar = styled.aside`
     flex-direction: column;
     gap: 2rem;
     padding: 1.5rem 1rem 1rem;
     background: ${colors.deep};
     border-right: 1px solid ${colors.line};

     /* Xodim va ega: telefonda chapdan ochiladigan panel. Mijoz: telefonda yashirin (pastda tab panel bor) */
     ${({ $drawer, $open }) => $drawer ? css`
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 40;
          width: min(${SIDEBAR}, 82vw);
          display: flex;
          transform: translateX(${$open ? "0" : "-100%"});
          transition: transform 0.25s ease;
          overflow-y: auto;
     ` : css`
          display: none;
     `}

     nav {
          display: grid;
          gap: 1.5rem;
          flex: 1;
          align-content: start;
     }

     ${media.desktop} {
          position: sticky;
          top: 0;
          z-index: auto;
          display: flex;
          width: auto;
          height: 100vh;
          transform: none;
          transition: none;
          overflow-y: auto;
     }

     @media (prefers-reduced-motion: reduce) {
          transition: none;
     }
`

export const NavGroup = styled.div`
     display: grid;
     gap: 0.25rem;
`

export const NavLabel = styled.p`
     padding: 0 0.75rem 0.4rem;
     color: ${colors.steel};
     font-size: 0.8125rem;
     font-weight: 600;
`

export const NavButton = styled.button`
     display: flex;
     align-items: center;
     gap: 0.75rem;
     min-height: 2.75rem;
     padding: 0 0.75rem;
     border: 0;
     border-left: 3px solid transparent;
     border-radius: 0 ${layout.radius} ${layout.radius} 0;
     background: transparent;
     color: ${colors.steel};
     font-weight: 600;
     text-align: left;
     cursor: pointer;
     transition: background-color 0.15s ease, color 0.15s ease;

     &:hover {
          background: rgba(141, 180, 255, 0.08);
          color: ${colors.floor};
     }

     ${({ $active }) => $active && css`
          border-left-color: ${colors.neon};
          background: rgba(61, 99, 255, 0.22);
          color: ${colors.floor};
     `}

     ${focusRing}
`

export const UserBox = styled.div`
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 0.5rem;
     padding-top: 1rem;
     border-top: 1px solid ${colors.line};

     strong,
     span {
          display: block;
          line-height: 1.3;
     }

     span {
          color: ${colors.steel};
          font-size: 0.875rem;
     }
`

export const Logout = styled.button`
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
          color: ${colors.danger};
          border-color: ${colors.danger};
     }

     ${focusRing}
`

/* Mijoz: telefondagi pastki tab panel */
export const Tabbar = styled.nav`
     position: fixed;
     inset: auto 0 0 0;
     z-index: 20;
     display: flex;
     height: ${TABBAR};
     background: ${colors.deep};
     border-top: 1px solid ${colors.line};
     padding-bottom: env(safe-area-inset-bottom);

     ${media.desktop} {
          display: none;
     }
`

export const TabButton = styled.button`
     display: flex;
     flex: 1;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     gap: 0.2rem;
     border: 0;
     background: transparent;
     color: ${colors.steel};
     font-size: 0.75rem;
     font-weight: 600;
     cursor: pointer;
     ${focusRing}

     ${({ $active }) => $active && css`
          color: ${colors.floor};
          box-shadow: inset 0 3px 0 ${colors.neon};
          background: rgba(61, 99, 255, 0.18);
     `}
`

/* Asosiy qism */
export const Main = styled.main`
     min-width: 0;
`

export const Content = styled.div`
     width: 100%;
     max-width: ${({ $narrow }) => ($narrow ? "52rem" : "72rem")};
     margin: 0 auto;
     padding: 1.5rem 1rem ${({ $narrow }) => ($narrow ? `calc(${TABBAR} + 2rem)` : "3rem")};
     display: grid;
     grid-template-columns: minmax(0, 1fr);
     gap: 2rem;
     align-content: start;

     ${media.tablet} {
          padding: 2rem 2rem ${({ $narrow }) => ($narrow ? `calc(${TABBAR} + 2rem)` : "4rem")};
     }

     ${media.desktop} {
          padding-bottom: 4rem;
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

/* Mijoz: salomlashish, abonement bloki. Katakchalar qog'oz kartadagidek: 5 ustun x 3 qator (15 tashrif) */
export const Greeting = styled.div`
     h1 {
          ${display};
          font-size: clamp(2rem, 6vw, 3rem);
     }

     p {
          margin-top: 0.75rem;
          color: ${colors.steel};
     }

     strong {
          color: ${colors.floor};
          font-size: 1.1em;
     }
`

export const Plan = styled.section`
     display: grid;
     gap: 1.25rem;
     padding: clamp(1.25rem, 3vw, 2rem);
     border-radius: ${layout.radius};
     background: ${gradients.ticket};
`

export const PlanHead = styled.div`
     display: flex;
     align-items: center;
     justify-content: space-between;
     flex-wrap: wrap;
     gap: 0.5rem 1rem;

     h2 {
          ${display};
          font-size: clamp(1.4rem, 4vw, 1.9rem);
     }
`

export const Stamps = styled.div`
     display: grid;
     grid-template-columns: repeat(5, 1fr);
     gap: clamp(0.4rem, 1.5vw, 0.75rem);
`

export const Stamp = styled.div`
     display: grid;
     place-items: center;
     aspect-ratio: 1;
     border-radius: ${layout.radius};
     font-family: ${fonts.heading};
     font-weight: 800;
     font-size: clamp(0.9rem, 2.5vw, 1.25rem);

     ${({ $kind }) => $kind === "used" && css`
          background: ${colors.floor};
          color: ${colors.wall};
     `}

     ${({ $kind }) => $kind === "next" && css`
          border: 2px solid ${colors.floor};
          background: rgba(234, 240, 255, 0.12);
     `}

     ${({ $kind }) => $kind === "empty" && css`
          border: 1px solid rgba(234, 240, 255, 0.35);
          color: rgba(234, 240, 255, 0.7);
     `}
`

export const StampNote = styled.p`
     color: rgba(234, 240, 255, 0.8);
     font-size: 0.9375rem;
`

export const Facts = styled.dl`
     display: grid;
     gap: 1rem;
     padding-top: 1.25rem;
     border-top: 1px solid rgba(234, 240, 255, 0.28);

     ${media.tablet} {
          grid-template-columns: repeat(3, auto);
          justify-content: space-between;
     }
`

export const Fact = styled.div`
     strong {
          display: block;
          font-family: ${fonts.heading};
          font-weight: 800;
          font-stretch: 115%;
          font-size: clamp(1.4rem, 4vw, 1.9rem);
          line-height: 1.15;
     }

     span {
          color: rgba(234, 240, 255, 0.82);
          font-size: 0.9375rem;
     }
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

export const EmptyLink = styled.a`
     justify-self: start;
     margin-top: 0.5rem;
     font-weight: 700;
     text-decoration: underline;
     text-decoration-color: ${colors.neon};
     text-underline-offset: 0.25em;
     ${focusRing}
`

export const StatePill = styled.span`
     padding: 0.25rem 0.8rem;
     border-radius: 999px;
     font-size: 0.875rem;
     font-weight: 700;
     background: ${colors.night};
     color: ${({ $tone }) => ($tone === "ok" ? colors.ok : $tone === "warn" ? colors.warn : colors.danger)};
`