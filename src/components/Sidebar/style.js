import styled, { css } from "styled-components"
import { colors, fonts, layout, media } from "../../utils/theme"

// Yon menyu kengligi va mijozning pastki tab paneli balandligi. Karkas (Dashboard/style.js) shularga tayanadi.
export const SIDEBAR = "16rem"
export const TABBAR = "4.25rem"

const focusRing = css`
     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
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
