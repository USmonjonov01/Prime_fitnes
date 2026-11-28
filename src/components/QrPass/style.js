import styled from "styled-components"
import { colors, display, layout, media } from "../../utils/theme"

// Mijoz sahifasidagi kirish QR kodi
export const Pass = styled.section`
     display: grid;
     gap: 1rem;
     justify-items: center;
     padding: clamp(1.25rem, 3vw, 2rem);
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.deep};
     text-align: center;

     h2 {
          ${display};
          font-size: clamp(1.25rem, 3.5vw, 1.6rem);
     }

     ${media.tablet} {
          justify-items: start;
          text-align: left;
     }
`

// Skanerlar qora-oq kontrastni yaxshi o'qiydi: fon doim oq (mavzu rangidan qat'i nazar), atrofidagi oq maydon "quiet zone"
export const Box = styled.div`
     width: min(100%, 17rem);
     padding: 1rem;
     border-radius: ${layout.radius};
     background: #fff;

     svg {
          display: block;
          width: 100%;
          height: auto;
     }
`

export const Bar = styled.div`
     width: min(100%, 17rem);
     height: 4px;
     border-radius: 2px;
     background: ${colors.line};
     overflow: hidden;

     &::after {
          content: "";
          display: block;
          height: 100%;
          width: ${({ $ratio }) => Math.max(0, Math.min(1, $ratio)) * 100}%;
          background: ${({ $low }) => ($low ? colors.warn : colors.ok)};
          transition: width 1s linear;
     }
`

export const Note = styled.p`
     max-width: 34rem;
     color: ${colors.steel};
     font-size: 0.9375rem;
`

export const Placeholder = styled.div`
     display: grid;
     gap: 0.75rem;
     justify-items: inherit;
     min-height: 8rem;
     align-content: center;
     color: ${colors.steel};
`

export const Retry = styled.button`
     min-height: 2.75rem;
     padding: 0 1.25rem;
     border: 1px solid ${colors.neon};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.floor};
     font: inherit;
     font-weight: 700;
     cursor: pointer;

     &:hover {
          background: rgba(141, 180, 255, 0.12);
     }

     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
     }
`