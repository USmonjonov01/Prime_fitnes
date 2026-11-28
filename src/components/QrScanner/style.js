import styled from "styled-components"
import { colors, layout } from "../../utils/theme"

export const Scanner = styled.div`
     display: grid;
     gap: 0.75rem;
     justify-items: start;
`

export const Frame = styled.div`
     position: relative;
     width: 100%;
     max-width: 26rem;
     aspect-ratio: 4 / 3;
     overflow: hidden;
     border: 2px solid rgba(234, 240, 255, 0.35);
     border-radius: ${layout.radius};
     background: #000;

     video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
     }
`

// Markaziy ramka: QR shu yerga to'g'rilanadi, atrofi xiralashtiriladi
export const Aim = styled.span`
     position: absolute;
     inset: 16%;
     border: 3px solid ${colors.neon};
     border-radius: 12px;
     box-shadow: 0 0 0 999px rgba(5, 9, 24, 0.4);
     pointer-events: none;
`

export const State = styled.p`
     color: rgba(234, 240, 255, 0.85);
     font-size: 0.9375rem;
`

export const Problem = styled.p`
     width: 100%;
     max-width: 26rem;
     padding: 0.8rem 1rem;
     border-left: 4px solid ${colors.danger};
     background: rgba(255, 93, 93, 0.22);
     font-weight: 600;
`