import { useId, useState } from "react"
import { Link } from "react-router-dom"
import {
     Actions, ContactSection, GhostButton, Lead, PhoneLink, PrimaryButton, SectionTitle, Wrap,
} from "../Home/style"
import {
     AltBlock, Block, Faq, FaqAnswer,
     FaqItem, FaqQuestion, Head, HeroInner, HeroLinks, PageHero, PageTitle, Plan, PlanHead, PlanPrice,
     PlanRow, PlanRows, Plans, Zone, Zones,
} from "./style"
import { BenchIcon, DumbbellIcon, RackIcon } from "./icons"
import {
     ADDRESS, EQUIPMENT, EXTRA_SERVICES, INSTAGRAM, MONTH_VISIT_LIMIT, PHONE, PHONE_VIEW, PRICES,
} from "../../utils/gym"
import Compare from "../Compare"

const ICONS = [DumbbellIcon, RackIcon, BenchIcon]
const CONFIRMED_EXTRAS = EXTRA_SERVICES.filter(({ confirmed }) => confirmed)
const ZONES = [
     ...EQUIPMENT.map((item, i) => ({ ...item, Icon: ICONS[i] ?? DumbbellIcon })),
     ...CONFIRMED_EXTRAS.map((item) => ({ ...item, Icon: DumbbellIcon })),
]

const FAQ = [
     {
          q: "Bir kunlik va oylik abonementning farqi nima?",
          a: <p>
               Bir kunlik abonement kirgan kuningiz davomida, oylik abonement bir oy davomida amal qiladi.
               Ikkalasida ham zalning barcha jihozlaridan foydalanasiz.
          </p>,
     },
     {
          q: "Qaysi abonement menga foydali?",
          a: <p>
               Bu oyiga necha marta kelishingizga bog'liq. Yuqoridagi solishtirishda ikkita abonementni tanlang,
               kelish sonini belgilang, hisoblagich oyiga va bitta tashrifga qancha tushishini ko'rsatadi.
          </p>,
     },
     {
          q: "Oyiga necha marta kelish mumkin?",
          a: <p>
               Oylik va undan uzun abonementlarda oyiga {MONTH_VISIT_LIMIT} martagacha kelish mumkin, ya'ni kun ora.
               Bir kunlik abonement bir marta kirish uchun.
          </p>,
     },
     {
          q: "Zal qayerda joylashgan?",
          a: <p>
               {ADDRESS.join(", ")}. Xaritadagi joyni <Link to="/about#manzil">Biz haqimizda</Link> sahifasidan ko'rishingiz mumkin.
          </p>,
     },
     {
          q: "Savolim bo'lsa kimga murojaat qilaman?",
          a: <p>
               <a href={`tel:${PHONE}`}>{PHONE_VIEW}</a> raqamiga qo'ng'iroq qiling yoki Instagramda{" "}
               <a href={`https://www.instagram.com/${INSTAGRAM}/`} target="_blank" rel="noreferrer">@{INSTAGRAM}</a> ga yozing.
          </p>,
     },
]

const FaqRow = ({ q, a }) => {
     const [open, setOpen] = useState(false)
     const answerId = useId()

     return <FaqItem>
          <h3>
               <FaqQuestion
                    type="button"
                    $open={open}
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpen((v) => !v)}
               >
                    {q}
               </FaqQuestion>
          </h3>
          <FaqAnswer id={answerId} $open={open}>
               <div>{a}</div>
          </FaqAnswer>
     </FaqItem>
}

const Services = () => {
     return <main>
          <PageHero>
               <HeroInner>
                    <PageTitle>Xizmatlar</PageTitle>
                    <Lead>
                         Abonement turlari, narxlar va zaldagi jihozlar. Oyiga necha marta kelishingizga qarab
                         qaysi abonement foydali ekanini hisoblab ko'ring.
                    </Lead>
                    <HeroLinks>
                         <PrimaryButton href="#abonementlar">Abonementlarni ko'rish</PrimaryButton>
                         <GhostButton href="#jihozlar">Zal jihozlari</GhostButton>
                    </HeroLinks>
               </HeroInner>
          </PageHero>

          <Block id="abonementlar">
               <Wrap>
                    <Head>
                         <SectionTitle>Abonementlar</SectionTitle>
                    </Head>

                    <Plans>
                         {PRICES.map(({ id, name, note, price, featured, includes }) => (
                              <Plan key={id} $featured={featured}>
                                   <PlanHead>
                                        <h3>{name}</h3>
                                        <PlanPrice>
                                             {price
                                                  ? <><strong>{price}</strong><span>so'm</span></>
                                                  : <span>Narxi aniqlanmoqda</span>}
                                        </PlanPrice>
                                   </PlanHead>
                                   <PlanRows>
                                        <PlanRow $featured={featured}>
                                             <dt>Muddati</dt>
                                             <dd>{note}</dd>
                                        </PlanRow>
                                        <PlanRow $featured={featured}>
                                             <dt>Nimalar kiradi</dt>
                                             <dd>{includes[0]}</dd>
                                        </PlanRow>
                                        {id !== "day" && MONTH_VISIT_LIMIT !== null && (
                                             <PlanRow $featured={featured}>
                                                  <dt>Tashriflar soni</dt>
                                                  <dd>Oyiga {MONTH_VISIT_LIMIT} martagacha (kun ora)</dd>
                                             </PlanRow>
                                        )}
                                   </PlanRows>
                              </Plan>
                         ))}
                    </Plans>

                    <Compare />
               </Wrap>
          </Block>

          <AltBlock id="jihozlar">
               <Wrap>
                    <Head>
                         <SectionTitle>Zalda nima qilish mumkin</SectionTitle>
                    </Head>
                    <Zones>
                         {ZONES.map(({ title, text, Icon }) => (
                              <Zone key={title}>
                                   <Icon />
                                   <h3>{title}</h3>
                                   <p>{text}</p>
                              </Zone>
                         ))}
                    </Zones>
               </Wrap>
          </AltBlock>

          <Block id="savollar">
               <Wrap>
                    <Head>
                         <SectionTitle>Ko'p so'raladigan savollar</SectionTitle>
                    </Head>
                    <Faq>
                         {FAQ.map(({ q, a }) => <FaqRow key={q} q={q} a={a} />)}
                    </Faq>
               </Wrap>
          </Block>

          <ContactSection>
               <Wrap>
                    <SectionTitle>Abonement olmoqchimisiz?</SectionTitle>
                    <PhoneLink href={`tel:${PHONE}`}>{PHONE_VIEW}</PhoneLink>
                    <Actions>
                         <GhostButton as={Link} to="/about#manzil">Zalni xaritada ko'rish</GhostButton>
                         <GhostButton href={`https://www.instagram.com/${INSTAGRAM}/`} target="_blank" rel="noreferrer">
                              Instagramda yozish
                         </GhostButton>
                    </Actions>
               </Wrap>
          </ContactSection>
     </main>
}

export default Services