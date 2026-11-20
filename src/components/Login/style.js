import styled, { css } from "styled-components"
import { colors, display, fonts, layout, media } from "../../utils/theme"

export const Page = styled.main`
     min-height: 100vh;
     padding: calc(${layout.navHeight} + clamp(2rem, 6vw, 4.5rem)) 0 clamp(3rem, 8vw, 6rem);
     background:
          radial-gradient(70% 55% at 12% 0%, rgba(27, 59, 232, 0.45) 0%, rgba(5, 9, 24, 0) 70%),
          ${colors.night};
`

export const Grid = styled.div`
     width: 100%;
     max-width: ${layout.maxWidth};
     margin: 0 auto;
     padding: 0 ${layout.gutter};
     display: grid;
     gap: clamp(2.5rem, 6vw, 4rem);

     ${media.desktop} {
          grid-template-columns: minmax(0, 26rem) minmax(0, 1fr);
          gap: clamp(3rem, 7vw, 6rem);
          align-items: start;
     }
`

/* Forma */
export const Title = styled.h1`
     ${display};
     font-stretch: 115%;
     font-size: clamp(2.2rem, 7vw, 3.4rem);
`

export const Form = styled.form`
     display: grid;
     gap: 1.25rem;
     margin-top: 2rem;
`

export const Field = styled.div`
     display: grid;
     gap: 0.4rem;

     label {
          font-weight: 600;
          color: ${colors.floor};
     }

     small {
          color: ${colors.steel};
          font-size: 0.875rem;
     }

     ${({ $prop }) => $prop === "checkbox" && css`
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 0.75rem;

          label {
               cursor: pointer;
          }

          input {
               width: 1.25rem;
               height: 1.25rem;
               margin: 0;
               accent-color: ${colors.electric};
               cursor: pointer;
          }

          input:focus-visible {
               outline: 3px solid ${colors.neon};
               outline-offset: 3px;
          }
     `}
`

export const Input = styled.input`
     width: 100%;
     min-height: 3.25rem;
     padding: 0 1rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.deep};
     color: ${colors.floor};
     font: inherit;
     font-size: 1rem;
     transition: border-color 0.2s ease, box-shadow 0.2s ease;

     &:hover {
          border-color: rgba(141, 180, 255, 0.4);
     }

     &:focus-visible {
          outline: none;
          border-color: ${colors.neon};
          box-shadow: 0 0 0 3px rgba(61, 99, 255, 0.45);
     }
`

export const Submit = styled.button`
     min-height: 3.25rem;
     border: 0;
     border-radius: ${layout.radius};
     background: ${colors.electric};
     color: #fff;
     font: inherit;
     font-weight: 700;
     cursor: pointer;
     transition: background-color 0.2s ease;

     &:hover {
          background: ${colors.electricHover};
     }

     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 3px;
     }

     &:disabled {
          opacity: 0.6;
          cursor: progress;
     }
`

export const Notice = styled.p`
     padding: 0.85rem 1rem;
     border-left: 3px solid ${colors.warn};
     background: rgba(245, 184, 61, 0.08);
     color: ${colors.floor};
     font-size: 0.95rem;

     ${({ $tone }) => $tone === "error" && css`
          border-left-color: ${colors.danger};
          background: rgba(255, 93, 93, 0.08);
     `}

     ${({ $tone }) => $tone === "ok" && css`
          border-left-color: ${colors.ok};
          background: rgba(47, 211, 140, 0.08);
     `}
`

/* Akkaunt yo'qmi: tushuntirish */
export const Info = styled.section`
     ${media.desktop} {
          padding-left: clamp(2rem, 5vw, 4rem);
          border-left: 1px solid ${colors.line};
     }
`

export const InfoTitle = styled.h2`
     ${display};
     font-stretch: 115%;
     font-size: clamp(1.6rem, 4.5vw, 2.4rem);
`

export const InfoLead = styled.p`
     max-width: 36rem;
     margin-top: 1rem;
     color: ${colors.steel};
     font-size: 1.0625rem;
`

export const Steps = styled.ol`
     display: grid;
     gap: 1.25rem;
     margin: 2rem 0 0;
     padding: 0;
     list-style: none;
     counter-reset: step;

     li {
          position: relative;
          padding-left: 3rem;
          counter-increment: step;
          max-width: 36rem;
     }

     li::before {
          content: counter(step);
          position: absolute;
          left: 0;
          top: 0;
          display: grid;
          place-items: center;
          width: 2rem;
          height: 2rem;
          border: 1px solid ${colors.neon};
          border-radius: 50%;
          color: ${colors.neon};
          font-family: ${fonts.heading};
          font-weight: 800;
          font-size: 0.9rem;
     }

     strong {
          display: block;
          color: ${colors.floor};
     }

     span {
          color: ${colors.steel};
     }
`

export const Cases = styled.div`
     margin-top: 2.5rem;
     max-width: 36rem;
     border-top: 1px solid ${colors.line};

     details {
          border-bottom: 1px solid ${colors.line};
     }

     summary {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 0;
          cursor: pointer;
          font-weight: 600;
          color: ${colors.floor};
          list-style: none;
     }

     summary::-webkit-details-marker {
          display: none;
     }

     summary::after {
          content: "+";
          color: ${colors.neon};
          font-size: 1.25rem;
          line-height: 1;
     }

     details[open] summary::after {
          content: "–";
     }

     summary:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
     }

     details p {
          padding: 0 0 1.1rem;
          color: ${colors.steel};
     }
`

export const Contact = styled.p`
     margin-top: 2rem;
     color: ${colors.steel};

     a {
          color: ${colors.floor};
          font-weight: 700;
          text-decoration: underline;
          text-decoration-color: ${colors.neon};
          text-underline-offset: 0.25em;
     }
`

export const Secondary = styled.button`
     min-height: 3.25rem;
     border: 1px solid ${colors.neon};
     border-radius: ${layout.radius};
     background: transparent;
     color: ${colors.floor};
     font: inherit;
     font-weight: 700;
     cursor: pointer;
     transition: background-color 0.2s ease, color 0.2s ease;

     &:hover {
          background: ${colors.neon};
          color: ${colors.night};
     }

     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 3px;
     }
`