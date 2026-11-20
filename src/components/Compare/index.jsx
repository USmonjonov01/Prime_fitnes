import { useId, useState } from "react"
import {
     Bars, BarFill, BarHead, BarTrack, Best, Calc, CalcLabel, CalcTitle, Note, Slider, SliderScale, Verdict,
} from "../Services/style"
import { Choice, Choices, Figures, Select } from "./style"
import { MONTH_VISIT_LIMIT, PRICES } from "../../utils/gym"

// "250 000" -> 250000
const toNumber = (text) => Number(String(text).replace(/\D/g, ""))
// 250000 -> "250 000"
const money = (value) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")

const DAY_PRICE = toNumber(PRICES.find(({ id }) => id === "day").price)
const MAX_VISITS = MONTH_VISIT_LIMIT ?? 30

// Abonementning ma'lum oyiga to'g'ri keladigan narx: bir kunlikda tashriflar soniga bog'liq,
// qolganlarida narx qat'iy.
const perMonth = (plan, visits) => (plan.months === null ? DAY_PRICE * visits : toNumber(plan.price) / plan.months)

const PlanSelect = ({ label, value, onChange }) => {
     const id = useId()
     return <Choice>
          <label htmlFor={id}>{label}</label>
          <Select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
               {PRICES.map(({ id: planId, name, price }) => (
                    <option key={planId} value={planId} disabled={price === null}>
                         {name}{price === null ? " (narxi aniqlanmagan)" : ""}
                    </option>
               ))}
          </Select>
     </Choice>
}

const Compare = () => {
     const [firstId, setFirstId] = useState("month")
     const [secondId, setSecondId] = useState("quarter")
     const [visits, setVisits] = useState(Math.min(10, MAX_VISITS))
     const inputId = useId()

     const first = PRICES.find(({ id }) => id === firstId)
     const second = PRICES.find(({ id }) => id === secondId)

     // Ikkalasini bir xil muddat uchun solishtiramiz: uzunroq abonement necha oy bo'lsa, shuncha oy uchun.
     const span = Math.max(first.months ?? 1, second.months ?? 1)
     const rows = [first, second].map((plan) => {
          const month = perMonth(plan, visits)
          return { plan, month, visit: month / visits, total: month * span }
     })
     const peak = Math.max(rows[0].total, rows[1].total)
     const difference = Math.abs(rows[0].total - rows[1].total)
     const winner = rows[0].total < rows[1].total ? 0 : rows[1].total < rows[0].total ? 1 : null
     const fill = ((visits - 1) / (MAX_VISITS - 1)) * 100

     return <Calc aria-labelledby={`${inputId}-title`}>
          <CalcTitle id={`${inputId}-title`}>Abonementlarni solishtiring</CalcTitle>

          <Choices>
               <PlanSelect label="Birinchi abonement" value={firstId} onChange={setFirstId} />
               <PlanSelect label="Ikkinchi abonement" value={secondId} onChange={setSecondId} />
          </Choices>

          <CalcLabel htmlFor={inputId}>
               Oyiga necha marta kelasiz?
               <output htmlFor={inputId}>{visits} marta</output>
          </CalcLabel>
          <Slider
               id={inputId}
               type="range"
               min="1"
               max={MAX_VISITS}
               value={visits}
               style={{ "--fill": `${fill}%` }}
               aria-valuetext={`${visits} marta`}
               onChange={(e) => setVisits(Number(e.target.value))}
          />
          <SliderScale aria-hidden="true">
               <span>1</span>
               <span>{MAX_VISITS}</span>
          </SliderScale>

          <Bars>
               {rows.map(({ plan, month, visit, total }, i) => (
                    <div key={i}>
                         <BarHead>
                              <span>
                                   {plan.name}
                                   {winner === i && <Best>Foydaliroq</Best>}
                              </span>
                              <strong>{money(total)} so'm</strong>
                         </BarHead>
                         <BarTrack aria-hidden="true">
                              <BarFill $best={winner === i} style={{ width: `${(total / peak) * 100}%` }} />
                         </BarTrack>
                         <Figures>
                              <span>Oyiga: {money(month)} so'm</span>
                              <span>Bitta tashrif: {money(visit)} so'm</span>
                         </Figures>
                    </div>
               ))}
          </Bars>

          <Verdict role="status">
               {winner === null
                    ? "Ikkalasi bir xil narxda."
                    : `${span} oy davomida ${rows[winner].plan.name.toLowerCase()} abonement ${money(difference)} so'm arzonroq (oyiga taxminan ${money(difference / span)} so'm).`}
          </Verdict>

          <Note style={{ marginTop: "0.5rem" }}>
               Narxlar {span} oy uchun hisoblangan{span > 1 ? ", chunki eng uzun tanlangan abonement shuncha vaqt amal qiladi" : ""}.
               Oyiga {visits} marta kelishingizni nazarda tutadi.
          </Note>
          {MONTH_VISIT_LIMIT !== null && (
               <Note>Bir kunlikdan boshqa abonementlarda oyiga {MONTH_VISIT_LIMIT} martagacha kelish mumkin.</Note>
          )}
     </Calc>
}

export default Compare