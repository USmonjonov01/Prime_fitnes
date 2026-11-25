import styled, { css } from "styled-components"
import { colors, display, fonts, gradients, layout, media } from "../../../utils/theme"

const focusRing = css`
     &:focus-visible {
          outline: 3px solid ${colors.neon};
          outline-offset: 2px;
     }
`

export const SampleNote = styled.p`
     padding: 0.7rem 1rem;
     border-left: 3px solid ${colors.warn};
     background: rgba(245, 184, 61, 0.08);
     font-size: 0.9375rem;
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
     padding: 0; /* <button as="..."> sifatida ham ishlatiladi ("Qayta yuklash"): brauzerning tugma ko'rinishi olib tashlanadi */
     border: 0;
     background: none;
     color: inherit;
     font: inherit;
     cursor: pointer;
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
