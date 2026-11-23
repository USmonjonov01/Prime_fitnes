import styled from "styled-components"
import { colors, display, fonts } from "../../../utils/theme"

export const Title = styled.h1`
     ${display};
     font-size: clamp(1.75rem, 4vw, 2.5rem);
`

export const Card = styled.dl`
     display: grid;
     border-top: 1px solid ${colors.line};

     div {
          display: grid;
          gap: 0.2rem;
          padding: 1rem 0;
          border-bottom: 1px solid ${colors.line};
     }

     dt {
          color: ${colors.steel};
          font-size: 0.9375rem;
     }

     dd {
          font-family: ${fonts.body};
          font-size: 1.15rem;
          font-weight: 600;
     }

     small {
          color: ${colors.steel};
          font-size: 0.875rem;
          font-weight: 400;
     }
`
