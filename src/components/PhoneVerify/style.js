import styled, { css } from "styled-components"
import { colors, layout } from "../../utils/theme"

const focusRing = css`
     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
     }
`

export const Box = styled.section`
     display: grid;
     gap: 0.75rem;
     padding: 1rem;
     border: 1px solid ${({ $tone }) => ($tone === "ok" ? colors.ok : colors.line)};
     border-radius: ${layout.radius};
     background: rgba(141, 180, 255, 0.05);
`

export const Head = styled.div`
     display: flex;
     flex-wrap: wrap;
     align-items: center;
     justify-content: space-between;
     gap: 0.5rem 1rem;

     strong {
          font-weight: 700;
     }
`

export const Hint = styled.p`
     color: ${colors.steel};
     font-size: 0.9rem;
     overflow-wrap: anywhere;
`

export const Row = styled.div`
     display: flex;
     flex-wrap: wrap;
     gap: 0.6rem;
`

export const CodeInput = styled.input`
     flex: 1 1 9rem;
     min-width: 0;
     min-height: 3rem;
     padding: 0 0.9rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.night};
     color: ${colors.floor};
     font: inherit;
     font-size: 1.25rem;
     font-weight: 700;
     letter-spacing: 0.35em;
     font-variant-numeric: tabular-nums;

     &::placeholder {
          color: ${colors.steel};
          opacity: 0.5;
     }

     &:focus-visible {
          outline: none;
          border-color: ${colors.neon};
          box-shadow: 0 0 0 3px rgba(141, 180, 255, 0.35);
     }
`

export const Primary = styled.button`
     min-height: 3rem;
     padding: 0 1.25rem;
     border: 0;
     border-radius: ${layout.radius};
     background: ${colors.electric};
     color: #fff;
     font-weight: 800;
     cursor: pointer;

     &:hover:not(:disabled) {
          background: ${colors.electricHover};
     }

     &:disabled {
          opacity: 0.55;
          cursor: not-allowed;
     }

     ${focusRing}
`

export const Ghost = styled.button`
     min-height: 3rem;
     padding: 0 1rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.steel};
     font-weight: 600;
     font-variant-numeric: tabular-nums;
     cursor: pointer;

     &:hover:not(:disabled) {
          color: ${colors.floor};
          border-color: ${colors.steel};
     }

     &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
     }

     ${focusRing}
`

// Rang faqat qo'shimcha belgi: matn har doim yoziladi
export const Note = styled.p`
     font-size: 0.9rem;
     font-weight: 600;
     color: ${({ $tone }) => ($tone === "error" ? colors.danger : colors.ok)};
     overflow-wrap: anywhere;

     &:empty {
          display: none;
     }
`

export const Badge = styled.span`
     display: inline-block;
     padding: 0.2rem 0.7rem;
     border: 1px solid ${({ $tone }) => ($tone === "ok" ? colors.ok : colors.warn)};
     border-radius: 999px;
     color: ${({ $tone }) => ($tone === "ok" ? colors.ok : colors.warn)};
     font-size: 0.8125rem;
     font-weight: 700;
     white-space: nowrap;
`