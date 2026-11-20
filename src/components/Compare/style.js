import styled from "styled-components"
import { colors, layout, media } from "../../utils/theme"

export const Choices = styled.div`
     display: grid;
     gap: 1rem;
     margin: 1.25rem 0 1.5rem;

     ${media.tablet} {
          grid-template-columns: 1fr 1fr;
     }
`

export const Choice = styled.div`
     display: grid;
     gap: 0.4rem;

     label {
          font-weight: 600;
          color: ${colors.floor};
     }
`

export const Select = styled.select`
     width: 100%;
     min-height: 3rem;
     padding: 0 0.9rem;
     border: 1px solid ${colors.line};
     border-radius: ${layout.radius};
     background: ${colors.deep};
     color: ${colors.floor};
     font: inherit;
     cursor: pointer;

     &:hover {
          border-color: rgba(141, 180, 255, 0.4);
     }

     &:focus-visible {
          outline: none;
          border-color: ${colors.neon};
          box-shadow: 0 0 0 3px rgba(61, 99, 255, 0.45);
     }
`

/* Har bir abonement ostidagi: oyiga narx va bitta tashrif narxi */
export const Figures = styled.p`
     display: flex;
     flex-wrap: wrap;
     gap: 0.25rem 1.5rem;
     margin-top: 0.5rem;
     color: ${colors.steel};
     font-size: 0.9rem;
`