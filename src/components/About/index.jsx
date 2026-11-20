import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
     Actions, ContactSection, GhostButton, Lead, PhoneLink, PrimaryButton, Row, Rows, SectionTitle, Split, Wrap,
} from "../Home/style"
import {
     Address, AltBlock, Block, ConditionsGrid, DemoNote, Dot, Dots, Fact, Facts, HeroGrid, MapButtons, MapFrame,
     MapGrid, MapInfo, PageHero, PageTitle, Panorama, Prose, ReviewAuthor, ReviewButton, ReviewControls,
     ReviewStage, ReviewText, Stat, Stats, SubLink, SubNav, SubNavInner, SubTitle, Trainer, TrainerPhoto,
     Trainers,
} from "./style"
import {
     ADDRESS, AMENITIES, COORDS, DEMO, EQUIPMENT, HOURS, INSTAGRAM, OPENED_YEAR, PHONE, PHONE_VIEW,
     PRICES, REVIEWS, STORY, TRAINER_COUNT, TRAINERS,
} from "../../utils/gym"

// Zalning umumiy ko'rinishi rasmi: rasmni src/assets/gym/ papkasiga tashlab, shu yerda import qiling:
//   import hall from "../../assets/gym/hall-wide.jpg"
// va PANORAMA dagi `src: null` o'rniga `src: hall` yozing. Rasm kesilib to'ldiriladi (cover).
// import hall from "../../assets/gym/hall-wide.jpg"
const PANORAMA = { src: null, alt: "Zalning umumiy ko'rinishi", label: "Zalning umumiy ko'rinishi (rasm joyi)" }

const SECTIONS = [
     { id: "zal-haqida", label: "Zal haqida" },
     { id: "sharoit", label: "Shart-sharoit" },
     { id: "murabbiylar", label: "Murabbiylar" },
     { id: "fikrlar", label: "Fikrlar" },
     { id: "manzil", label: "Manzil" },
]

const YEARS = Math.max(1, new Date().getFullYear() - OPENED_YEAR)
const CONFIRMED_AMENITIES = AMENITIES.filter(({ confirmed }) => confirmed)
const MAP_URL = `https://yandex.com/map-widget/v1/?ll=${COORDS.lng}%2C${COORDS.lat}&z=16&pt=${COORDS.lng}%2C${COORDS.lat}%2Cpm2blm`
const YANDEX_LINK = `https://yandex.com/maps/?pt=${COORDS.lng},${COORDS.lat}&z=16&l=map`
const GOOGLE_LINK = `https://www.google.com/maps/search/?api=1&query=${COORDS.lat},${COORDS.lng}`

// Fikrlar har sahifa ochilganda aralash tartibda chiqadi va aylanib hammasi ko'rsatiladi.
// Keyinchalik fikrlar API dan kelganda shu yerda ro'yxat shunchaki yangilanadi.
const shuffle = (list) => {
     const copy = [...list]
     for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]]
     }
     return copy
}
const REVIEW_ORDER = shuffle(REVIEWS)
const REVIEW_DELAY = 9000

// Sahifada ko'rinib turgan bo'limni topadi (ichki menyuda belgilash uchun)
const useActiveSection = () => {
     const [active, setActive] = useState(null)

     useEffect(() => {
          const targets = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean)
          const observer = new IntersectionObserver(
               (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
               { rootMargin: "-30% 0px -60% 0px" },
          )
          targets.forEach((el) => observer.observe(el))
          return () => observer.disconnect()
     }, [])

     return active
}

const Reviews = () => {
     const [index, setIndex] = useState(0)
     const [paused, setPaused] = useState(false)
     const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
     const count = REVIEW_ORDER.length

     // Har 9 soniyada keyingi fikrga o'tadi. Sichqoncha ustida, fokusda yoki animatsiya o'chirilgan bo'lsa to'xtaydi.
     useEffect(() => {
          if (paused || reduced || count < 2) return
          const timer = setTimeout(() => setIndex((i) => (i + 1) % count), REVIEW_DELAY)
          return () => clearTimeout(timer)
     }, [index, paused, reduced, count])

     if (count === 0) return null
     const { id, name, meta, text } = REVIEW_ORDER[index]
     const go = (step) => setIndex((i) => (i + step + count) % count)

     return <div
          role="group"
          aria-roledescription="karusel"
          aria-label="Mijozlar fikrlari"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
     >
          <ReviewStage>
               <ReviewText key={`t${id}`}>{text}</ReviewText>
               <ReviewAuthor key={`a${id}`}>
                    <strong>{name}</strong>
                    <span>{meta}</span>
               </ReviewAuthor>
          </ReviewStage>

          {count > 1 && (
               <ReviewControls>
                    <ReviewButton type="button" data-dir="prev" aria-label="Oldingi fikr" onClick={() => go(-1)} />
                    <ReviewButton type="button" data-dir="next" aria-label="Keyingi fikr" onClick={() => go(1)} />
                    <Dots>
                         {REVIEW_ORDER.map((review, i) => (
                              <Dot
                                   key={review.id}
                                   type="button"
                                   aria-label={`${i + 1}-fikr`}
                                   aria-current={i === index}
                                   onClick={() => setIndex(i)}
                              />
                         ))}
                    </Dots>
               </ReviewControls>
          )}
     </div>
}

const About = () => {
     const active = useActiveSection()

     return <main>
          <PageHero>
               <HeroGrid>
                    <div>
                         <PageTitle>Biz haqimizda</PageTitle>
                         <Lead>
                              Prime Fit Kosonsoydagi fitnes markaz.   
                         </Lead>
                    </div>

                    <Stats>
                         <Stat>
                              <dd>{YEARS} yil</dd>
                              <dt>Kosonsoyda xizmat qilmoqda</dt>
                         </Stat>
                         <Stat>
                              <dd>{TRAINER_COUNT} ta</dd>
                              <dt>murabbiy</dt>
                         </Stat>
                         <Stat>
                              <dd>{PRICES[0].price}</dd>
                              <dt>so'mdan, bir kunlik</dt>
                         </Stat>
                    </Stats>
               </HeroGrid>
          </PageHero>

          <SubNav aria-label="Sahifa bo'limlari">
               <SubNavInner>
                    {SECTIONS.map(({ id, label }) => (
                         <SubLink key={id} href={`#${id}`} aria-current={active === id}>{label}</SubLink>
                    ))}
               </SubNavInner>
          </SubNav>

          {/* Zal haqida: hikoya va aloqa ma'lumotlari */}
          <Block id="zal-haqida">
               <Wrap>
                    <Split>
                         <div>
                              <SectionTitle>Zal haqida</SectionTitle>
                              <Prose>
                                   <p>Prime Fit {OPENED_YEAR}-yildan beri ishlaydi.</p>
                                   {STORY.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                              </Prose>
                         </div>

                         <Facts>
                              <Fact>
                                   <dt>Manzil</dt>
                                   <dd>{ADDRESS.map((line) => <span key={line}>{line}</span>)}</dd>
                              </Fact>
                              <Fact>
                                   <dt>Telefon</dt>
                                   <dd><a href={`tel:${PHONE}`}>{PHONE_VIEW}</a></dd>
                              </Fact>
                              <Fact>
                                   <dt>Instagram</dt>
                                   <dd>
                                        <a href={`https://www.instagram.com/${INSTAGRAM}/`} target="_blank" rel="noreferrer">
                                             @{INSTAGRAM}
                                        </a>
                                   </dd>
                              </Fact>
                              {HOURS.length > 0 && (
                                   <Fact>
                                        <dt>Ish vaqti</dt>
                                        <dd>{HOURS.map(({ days, time }) => <span key={days}>{days}: {time}</span>)}</dd>
                                   </Fact>
                              )}
                         </Facts>
                    </Split>

                    {PANORAMA.src
                         ? <Panorama><img src={PANORAMA.src} alt={PANORAMA.alt} loading="lazy" /></Panorama>
                         : <Panorama $empty role="img" aria-label={PANORAMA.alt}><span>{PANORAMA.label}</span></Panorama>}
               </Wrap>
          </Block>

          {/* Shart-sharoit: jihozlar va abonementga nimalar kirishi */}
          <AltBlock id="sharoit">
               <Wrap>
                    <SectionTitle>Shart-sharoit</SectionTitle>
                    <ConditionsGrid>
                         <div>
                              <SubTitle>Zalda nima bor</SubTitle>
                              <Rows>
                                   {[...EQUIPMENT, ...CONFIRMED_AMENITIES].map(({ title, text }) => (
                                        <Row key={title}>
                                             <h3>{title}</h3>
                                             <p>{text}</p>
                                        </Row>
                                   ))}
                              </Rows>
                         </div>

                         <div>
                              <SubTitle>Abonementga nimalar kiradi</SubTitle>
                              <Facts>
                                   {PRICES.map(({ id, name, price, includes }) => (
                                        <Fact key={id} $plain>
                                             <dt>{name}<br />{price ? `${price} so'm` : "narxi aniqlanmoqda"}</dt>
                                             <dd>{includes.map((item) => <span key={item}>{item}</span>)}</dd>
                                        </Fact>
                                   ))}
                              </Facts>
                         </div>
                    </ConditionsGrid>
               </Wrap>
          </AltBlock>

          <Block id="murabbiylar">
               <Wrap>
                    <SectionTitle>Murabbiylar</SectionTitle>
                    {DEMO.trainers && <DemoNote>Murabbiylar ro'yxati namuna. Haqiqiy ma'lumot keyin qo'shiladi.</DemoNote>}
                    <Trainers>
                         {TRAINERS.map(({ name, role, note, photo }) => (
                              <Trainer key={name}>
                                   <TrainerPhoto>
                                        {photo
                                             ? <img src={photo} alt={`Murabbiy ${name}`} loading="lazy" />
                                             : <span aria-hidden="true">{name[0]}</span>}
                                   </TrainerPhoto>
                                   <h3>{name}</h3>
                                   <strong>{role}</strong>
                                   {note && <p>{note}</p>}
                              </Trainer>
                         ))}
                    </Trainers>
               </Wrap>
          </Block>

          <AltBlock id="fikrlar">
               <Wrap>
                    <SectionTitle>Mijozlar fikri</SectionTitle>
                    <Reviews />
               </Wrap>
          </AltBlock>

          <Block id="manzil">
               <Wrap>
                    <SectionTitle>Bizni toping</SectionTitle>
                    <MapGrid>
                         <MapInfo>
                              <div>
                                   <Address>{ADDRESS.map((line) => <span key={line}>{line}</span>)}</Address>
                              </div>
                              <MapButtons>
                                   <PrimaryButton href={YANDEX_LINK} target="_blank" rel="noreferrer">Yandex xaritada ochish</PrimaryButton>
                                   <GhostButton href={GOOGLE_LINK} target="_blank" rel="noreferrer">Google xaritada ochish</GhostButton>
                              </MapButtons>
                         </MapInfo>

                         <MapFrame>
                              <iframe
                                   title="Gym Prime Fit joylashgan joy, Yandex xaritasi"
                                   src={MAP_URL}
                                   loading="lazy"
                                   referrerPolicy="no-referrer-when-downgrade"
                              />
                         </MapFrame>
                    </MapGrid>
               </Wrap>
          </Block>

          <ContactSection>
               <Wrap>
                    <SectionTitle>Savolingiz bormi?</SectionTitle>
                    <PhoneLink href={`tel:${PHONE}`}>{PHONE_VIEW}</PhoneLink>
                    <Actions>
                         <GhostButton as={Link} to="/home#narxlar">Narxlarni ko'rish</GhostButton>
                         <GhostButton href={`https://www.instagram.com/${INSTAGRAM}/`} target="_blank" rel="noreferrer">
                              Instagramda yozish
                         </GhostButton>
                    </Actions>
               </Wrap>
          </ContactSection>
     </main>
}

export default About