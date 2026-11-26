import styled from "styled-components"
import { colors, display } from "../../utils/theme"

// Voqealar lentasi: admin Bosh paneli va mijoz Bosh sahifasida bir xil ko'rinadi
export const Feed = styled.section`
     min-width: 0;
     margin-top: clamp(1.5rem, 3vw, 2.5rem);
`

export const FeedHead = styled.div`
     display: flex;
     flex-wrap: wrap;
     align-items: baseline;
     justify-content: space-between;
     gap: 0.4rem 1rem;
     padding-bottom: 0.9rem;
     border-bottom: 1px solid ${colors.line};

     h2 {
          ${display};
          font-size: 1.25rem;
     }

     small {
          color: ${colors.steel};
          font-size: 0.85rem;
     }
`

export const FeedList = styled.ul`
     list-style: none;
     max-height: 30rem;
     overflow-y: auto;
`

const TONES = { success: colors.ok, warning: colors.warn, info: colors.neon }

// Rang faqat qo'shimcha belgi: har voqea sarlavha va matn bilan ham yoziladi
export const FeedItem = styled.li`
     display: grid;
     gap: 0.15rem;
     padding: 0.8rem 0 0.8rem 0.9rem;
     border-bottom: 1px solid ${colors.line};
     border-left: 3px solid ${({ $kind }) => TONES[$kind] ?? colors.line};

     strong {
          line-height: 1.3;
     }

     p {
          color: ${colors.floor};
          font-size: 0.9375rem;
          overflow-wrap: anywhere;
     }

     time {
          color: ${colors.steel};
          font-size: 0.8125rem;
          font-variant-numeric: tabular-nums;
     }
`

export const FeedEmpty = styled.p`
     color: ${colors.steel};
     padding: 1rem 0;
`
