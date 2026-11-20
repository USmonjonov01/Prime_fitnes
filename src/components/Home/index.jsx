import { useId, useState } from "react"
import {
     Actions, Amount, Beam, ContactSection, Currency, Details, Gallery, GhostButton, Hero, HeroInner,
     Includes, Intro, Lead, PhoneLink, Photo, PricingSection, PrimaryButton, Row, Rows, Section,
     SectionTitle, Split, Ticket, TicketBottom, TicketMore, TicketMoreInner, TicketToggle, TicketTop,
     Tickets, Title, Wash, Wrap,
} from "./style"
import HeroBackground from "./HeroBackground"
import { ADDRESS, EQUIPMENT, INSTAGRAM, PHONE, PHONE_VIEW, PRICES } from "../../utils/gym"

// Zal rasmlarini qo'yish: rasmni src/assets/gym/ papkasiga tashlang, keyin shu yerda import qiling:
//   import hall1 from "../../assets/gym/hall-1.jpg"
// va GALLERY dagi `src: null` o'rniga `src: hall1` yozing. Rasm kesilib to'ldiriladi (cover),
// shuning uchun o'lchami muhim emas, lekin yengil bo'lsin (har biri ~300 KB gacha, .webp yoki .jpg).
// import hall1 from "../../assets/gym/hall-1.jpg"

const GALLERY = [
     { src: null, alt: "Zalning umumiy ko'rinishi", label: "Zalning umumiy ko'rinishi (rasm joyi)" },
     { src: null, alt: "Zal jihozlari", label: "Jihozlar (rasm joyi)" },
     { src: null, alt: "Mashq qilayotganlar", label: "Zal muhiti (rasm joyi)" },
]

const PriceTicket = ({ name, note, price, featured, includes }) => {
     const [open, setOpen] = useState(false)
     const moreId = useId()

     return <Ticket $featured={featured} $open={open}>
          <TicketTop $featured={featured}>
               <h3>{name}</h3>
               <p>{note}</p>
          </TicketTop>
          <TicketBottom $featured={featured}>
               {price
                    ? <><Amount>{price}</Amount><Currency $featured={featured}>so'm</Currency></>
                    : <Currency $featured={featured}>Narxi aniqlanmoqda</Currency>}
          </TicketBottom>

          <TicketMore id={moreId} $open={open}>
               <TicketMoreInner>
                    <Includes aria-label={`${name}ga nimalar kiradi`}>
                         {includes.map((item) => <li key={item}>{item}</li>)}
                    </Includes>
               </TicketMoreInner>
          </TicketMore>

          <TicketToggle
               type="button"
               $open={open}
               $featured={featured}
               aria-expanded={open}
               aria-controls={moreId}
               onClick={() => setOpen((v) => !v)}
          >
               {open ? "Yopish" : "Batafsil"}
          </TicketToggle>
     </Ticket>
}

const Home = () => {
     return <main>
          <Hero>
               <HeroBackground />
               <Wash aria-hidden="true" />
               <Beam viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M-20 330 H 380 L 500 215 H 1020" />
               </Beam>

               <HeroInner>
                    <Title>Prime Fit</Title>
                    <Lead>
                         Kosonsoydagi fitnes markaz. Ko'k nur ostidagi zalda ganteller,
                         stoykalar va skameykalar sizni kutadi.
                    </Lead>
                    <Actions>
                         <PrimaryButton href="#narxlar">Narxlarni ko'rish</PrimaryButton>
                         <GhostButton href={`tel:${PHONE}`}>Qo'ng'iroq qilish</GhostButton>
                    </Actions>
               </HeroInner>
          </Hero>

          <Section id="zal">
               <Wrap>
                    <Split>
                         <div>
                              <SectionTitle>Zalda nima bor</SectionTitle>
                              <Intro>Mashq uchun kerakli jihozlar bir joyda, hammasi qo'l ostida.</Intro>
                         </div>
                         <Rows>
                              {EQUIPMENT.map(({ title, text }) => (
                                   <Row key={title}>
                                        <h3>{title}</h3>
                                        <p>{text}</p>
                                   </Row>
                              ))}
                         </Rows>
                    </Split>

                    <Gallery>
                         {GALLERY.map(({ src, alt, label }) => (
                              src
                                   ? <Photo key={alt}><img src={src} alt={alt} loading="lazy" /></Photo>
                                   : <Photo key={alt} $empty role="img" aria-label={alt}><span>{label}</span></Photo>
                         ))}
                    </Gallery>
               </Wrap>
          </Section>

          <PricingSection id="narxlar">
               <Wrap>
                    <SectionTitle>Narxlar</SectionTitle>
                    <Tickets>
                         {PRICES.map(({ id, ...ticket }) => <PriceTicket key={id} {...ticket} />)}
                    </Tickets>
               </Wrap>
          </PricingSection>

          <ContactSection id="aloqa">
               <Wrap>
                    <SectionTitle>Bizga qo'ng'iroq qiling</SectionTitle>
                    <PhoneLink href={`tel:${PHONE}`}>{PHONE_VIEW}</PhoneLink>

                    <Details>
                         <div>
                              <h3>Manzil</h3>
                              {ADDRESS.map((line) => <p key={line}>{line}</p>)}
                         </div>
                         <div>
                              <h3>Instagram</h3>
                              <a href={`https://www.instagram.com/${INSTAGRAM}/`} target="_blank" rel="noreferrer">
                                   @{INSTAGRAM}
                              </a>
                         </div>
                    </Details>
               </Wrap>
          </ContactSection>
     </main>
}

export default Home