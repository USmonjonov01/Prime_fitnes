import { useCallback, useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {
     ActionButton, ChartBox, Empty, Figure, Figures, Hint, Legend, LegendItem, Note, PageHead, PageTitle, Panel, PanelTitle,
     Profit, Ranking, RankingItem, SegmentButton, Segmented, Table, TableWrap,
} from "./style"
import { colors, layout } from "../../../utils/theme"
import { NotificationData } from "../../../context/notifications"
import api from "../../../axios"

/* ------------------------------ Yordamchilar ------------------------------ */
// Dashboard dagi yordamchilarning nusxasi (umumiy util fayli yo'q, shuning uchun har komponentda o'zi bor).

const SPANS = [6, 12] // tanlanadigan davrlar (oy)

const money = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")

// Eksa belgisi: 2 000 000 -> "2 mln", 250 000 -> "250 ming"
const shortMoney = (value) => {
     if (value >= 1000000) return `${String(Number((value / 1000000).toFixed(1))).replace(".", ",")} mln`
     if (value >= 1000) return `${Math.round(value / 1000)} ming`
     return String(value)
}

// Farq: foyda "+", zarar "−" belgisi bilan (rangdan tashqari matnda ham ko'rinsin)
const signed = (value) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${money(Math.abs(value))}`
const toneOf = (value) => (value > 0 ? colors.ok : value < 0 ? colors.danger : undefined)

const tooltipStyle = {
     cursor: { fill: colors.line },
     contentStyle: { background: colors.deep, border: `1px solid ${colors.line}`, borderRadius: layout.radius, color: colors.floor },
     labelStyle: { color: colors.steel, fontWeight: 600 },
}

// Oy nomi diagrammada qisqa (Noy), tooltipda to'liq (Noyabr 2026)
const fullLabel = (_, payload) => payload?.[0]?.payload?.full

/* ------------------------------ Ma'lumot olish (backend) ------------------------------ */
//   GET /reports?months=6|12   faqat ega uchun. Hisob-kitob serverda: { rows, ranking, best, totals, customerCount, hasExpenses }
//   Chiqimlar: POST /expenses { amount, category?, note?, date? } (faqat ega). Hozircha ularni kiritish oynasi yo'q.

const loadReport = async (months) => (await api.get("/reports", { params: { months } })).data

/* ------------------------------ Bo'limlar ------------------------------ */

const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const ProfitChart = ({ rows, span }) => (
     <Panel aria-labelledby="profit-chart-title">
          <PanelTitle id="profit-chart-title">Kirim, chiqim va foyda</PanelTitle>
          <Legend aria-hidden="true">
               <LegendItem $kind="bar" $color={colors.ok}>Kirim</LegendItem>
               <LegendItem $kind="bar" $color={colors.danger}>Chiqim</LegendItem>
               <LegendItem $kind="line" $color={colors.neon}>Foyda / zarar</LegendItem>
          </Legend>
          <ChartBox role="img" aria-label={`Oxirgi ${span} oylik kirim, chiqim va foyda diagrammasi. Raqamlar pastdagi jadvalda.`}>
               <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                         <CartesianGrid stroke={colors.line} vertical={false} />
                         <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: colors.line }} tickMargin={8} interval={0} />
                         <YAxis width={58} tickLine={false} axisLine={false} tickFormatter={shortMoney} />
                         <Tooltip
                              {...tooltipStyle}
                              labelFormatter={fullLabel}
                              formatter={(value, name) => [`${money(value)} so'm`, name]}
                         />
                         <Bar dataKey="income" name="Kirim" fill={colors.ok} radius={[3, 3, 0, 0]} isAnimationActive={!reduceMotion()} />
                         <Bar dataKey="expense" name="Chiqim" fill={colors.danger} radius={[3, 3, 0, 0]} isAnimationActive={!reduceMotion()} />
                         <Line
                              type="monotone"
                              dataKey="profit"
                              name="Foyda / zarar"
                              stroke={colors.neon}
                              strokeWidth={3}
                              dot={{ r: 3, fill: colors.neon, strokeWidth: 0 }}
                              activeDot={{ r: 6 }}
                              isAnimationActive={!reduceMotion()}
                         />
                    </ComposedChart>
               </ResponsiveContainer>
          </ChartBox>
     </Panel>
)

const ProfitTable = ({ rows, totals, hasExpenses }) => (
     <Panel aria-labelledby="pl-title">
          <PanelTitle id="pl-title">Foyda va zarar jadvali</PanelTitle>
          {!hasExpenses && <Note>Chiqimlar ro'yxati bo'sh, shuning uchun foyda kirimga teng ko'rinadi. Chiqimlar adminlar API dagi /expenses ga kiritiladi.</Note>}
          <TableWrap tabIndex={0} role="region" aria-label="Foyda va zarar jadvali">
               <Table>
                    <caption>Oylar bo'yicha kirim, chiqim va foyda yoki zarar, so'mda</caption>
                    <thead>
                         <tr>
                              <th scope="col">Oy</th>
                              <th scope="col">Kirim</th>
                              <th scope="col">Chiqim</th>
                              <th scope="col">Foyda / zarar</th>
                         </tr>
                    </thead>
                    <tbody>
                         {rows.map((m) => (
                              <tr key={m.key}>
                                   <th scope="row">{m.full}</th>
                                   <td>{money(m.income)}</td>
                                   <td>{money(m.expense)}</td>
                                   <td><Profit $tone={toneOf(m.profit)}>{signed(m.profit)}</Profit></td>
                              </tr>
                         ))}
                    </tbody>
                    <tfoot>
                         <tr>
                              <th scope="row">Jami</th>
                              <td>{money(totals.income)}</td>
                              <td>{money(totals.expense)}</td>
                              <td><Profit $tone={toneOf(totals.profit)}>{signed(totals.profit)}</Profit></td>
                         </tr>
                    </tfoot>
               </Table>
          </TableWrap>
          <Hint>
               Kirim: sotilgan abonementlar narxi (sotilgan oyga yoziladi). Chiqim: chiqimlar ro'yxati.
               {totals.margin !== null && ` Davr bo'yicha foyda ulushi: ${totals.margin}%.`}
          </Hint>
     </Panel>
)

// Mijozlar oqimi (tashriflar) va pul nisbati: bir tashrifga qancha kirim va qancha chiqim to'g'ri keladi
const FlowChart = ({ rows, totals, span }) => (
     <Panel aria-labelledby="flow-title">
          <PanelTitle id="flow-title">Mijozlar oqimi va pul nisbati</PanelTitle>

          {totals.visits ? <>
               <Legend aria-hidden="true">
                    <LegendItem $kind="bar" $color={colors.electric}>Tashriflar soni</LegendItem>
                    <LegendItem $kind="line" $color={colors.ok}>Bir tashrifga kirim</LegendItem>
                    <LegendItem $kind="dashed" $color={colors.danger}>Bir tashrifga chiqim</LegendItem>
               </Legend>
               <ChartBox role="img" aria-label={`Oxirgi ${span} oylik tashriflar soni va bir tashrifga to'g'ri keladigan kirim va chiqim diagrammasi`}>
                    <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                              <CartesianGrid stroke={colors.line} vertical={false} />
                              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: colors.line }} tickMargin={8} interval={0} />
                              <YAxis yAxisId="visits" width={40} tickLine={false} axisLine={false} allowDecimals={false} />
                              <YAxis yAxisId="money" orientation="right" width={58} tickLine={false} axisLine={false} tickFormatter={shortMoney} />
                              <Tooltip
                                   {...tooltipStyle}
                                   labelFormatter={fullLabel}
                                   formatter={(value, name) => (name === "Tashriflar" ? [`${value} ta`, name] : [`${money(value)} so'm`, name])}
                              />
                              <Bar yAxisId="visits" dataKey="visits" name="Tashriflar" fill={colors.electric} radius={[3, 3, 0, 0]} isAnimationActive={!reduceMotion()} />
                              <Line
                                   yAxisId="money"
                                   type="monotone"
                                   dataKey="incomePerVisit"
                                   name="Bir tashrifga kirim"
                                   stroke={colors.ok}
                                   strokeWidth={3}
                                   dot={{ r: 3, fill: colors.ok, strokeWidth: 0 }}
                                   activeDot={{ r: 6 }}
                                   isAnimationActive={!reduceMotion()}
                              />
                              <Line
                                   yAxisId="money"
                                   type="monotone"
                                   dataKey="expensePerVisit"
                                   name="Bir tashrifga chiqim"
                                   stroke={colors.danger}
                                   strokeWidth={3}
                                   strokeDasharray="7 5"
                                   dot={{ r: 3, fill: colors.danger, strokeWidth: 0 }}
                                   activeDot={{ r: 6 }}
                                   isAnimationActive={!reduceMotion()}
                              />
                         </ComposedChart>
                    </ResponsiveContainer>
               </ChartBox>
               <Hint>
                    Davr bo'yicha: {totals.visits} ta tashrif, bir tashrifga o'rtacha {money(totals.incomePerVisit)} so'm kirim va {money(totals.expensePerVisit)} so'm chiqim.
                    Kirim sotilgan oyga, tashrif kelgan oyga yoziladi, shuning uchun oylik nisbat taxminiy.
               </Hint>
          </> : <Empty as="p">Tashriflar jurnali bo'sh. Kirishni belgilash boshlangach, bu yerda mijozlar oqimi va bir tashrifga to'g'ri keladigan kirim va chiqim ko'rinadi.</Empty>}
     </Panel>
)

const PlansPanel = ({ ranking, span }) => {
     const sold = ranking.reduce((sum, p) => sum + p.count, 0)

     return <Panel aria-labelledby="plans-title">
          <PanelTitle id="plans-title">Abonementlar sotuvi</PanelTitle>

          {sold ? <>
               <ChartBox $short role="img" aria-label={`Oxirgi ${span} oyda sotilgan abonementlar soni, tur bo'yicha`}>
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={ranking} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                              <CartesianGrid stroke={colors.line} horizontal={false} />
                              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={{ stroke: colors.line }} />
                              <YAxis type="category" dataKey="name" width={84} tickLine={false} axisLine={false} />
                              <Tooltip
                                   {...tooltipStyle}
                                   formatter={(value, _name, { payload }) => [`${value} ta, ${money(payload.revenue)} so'm`, "Sotildi"]}
                              />
                              <Bar dataKey="count" name="Sotildi" fill={colors.electric} radius={[0, 3, 3, 0]} isAnimationActive={!reduceMotion()} />
                         </BarChart>
                    </ResponsiveContainer>
               </ChartBox>

               <Ranking aria-label="Abonement turlari sotuv bo'yicha">
                    {ranking.map((p) => (
                         <RankingItem key={p.id}>
                              <strong>{p.name}</strong>
                              <span>{p.count} ta · {money(p.revenue)} so'm</span>
                         </RankingItem>
                    ))}
               </Ranking>
          </> : <Empty as="p">Bu davrda abonement sotilmagan.</Empty>}
     </Panel>
}

/* ------------------------------ Hisobotlar ------------------------------ */

const OwnerReports = () => {
     const [, notify] = NotificationData()
     const [report, setReport] = useState(null)
     const [failed, setFailed] = useState(false)
     const [span, setSpan] = useState(6)

     // Bu sahifaning ma'lumoti faqat shu yerda turadi: admins contextidagi `data` Bosh panelniki, ustidan yozilmaydi
     const reload = useCallback(async () => {
          const entity = "Hisobot"
          notify({ type: "GET_pending", payload: { entity } })
          try {
               setReport(await loadReport(span))
               setFailed(false)
               notify({ type: "GET_success", payload: { entity } })
          } catch (error) {
               setFailed(true)
               notify({ type: "GET_error", payload: { entity, error } })
          }
     }, [notify, span])

     // Davr (6 yoki 12 oy) almashganda hisobot serverdan qayta olinadi
     useEffect(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- serverdan ma'lumot olish
          reload()
     }, [reload])

     if (!report) {
          return failed
               ? <Empty>
                    <h2>Hisobotni yuklab bo'lmadi</h2>
                    <p>Internetni tekshirib, qayta urinib ko'ring.</p>
                    <ActionButton type="button" onClick={reload}>Qayta yuklash</ActionButton>
               </Empty>
               : <Empty as="p">Hisobot tayyorlanmoqda...</Empty>
     }

     const { rows, ranking, best, totals, customerCount, hasExpenses } = report

     return <>
          <PageHead>
               <PageTitle>Hisobotlar</PageTitle>
               <Segmented role="group" aria-label="Davr">
                    {SPANS.map((n) => (
                         <SegmentButton key={n} type="button" aria-pressed={span === n} $active={span === n} onClick={() => setSpan(n)}>
                              {n} oy
                         </SegmentButton>
                    ))}
               </Segmented>
          </PageHead>

          <Figures aria-label={`Oxirgi ${span} oylik ko'rsatkichlar`}>
               <Figure><strong>{customerCount}</strong><span>Jami mijozlar</span></Figure>
               <Figure>
                    <strong>{best ? best.name : "Hali yo'q"}</strong>
                    <span>Eng ko'p sotilgan{best ? `, ${best.count} ta` : ""}</span>
               </Figure>
               <Figure $tone={toneOf(totals.profit)}>
                    <strong>{signed(totals.profit)}</strong>
                    <span>{span} oylik {totals.profit < 0 ? "zarar" : "foyda"}, so'm</span>
               </Figure>
               <Figure>
                    <strong>{totals.incomePerVisit === null ? "—" : money(totals.incomePerVisit)}</strong>
                    <span>Bir tashrifga kirim, so'm</span>
               </Figure>
          </Figures>

          <ProfitChart rows={rows} span={span} />
          <ProfitTable rows={rows} totals={totals} hasExpenses={hasExpenses} />
          <FlowChart rows={rows} totals={totals} span={span} />
          <PlansPanel ranking={ranking} span={span} />
     </>
}

// Hisobotlar faqat ega uchun. Menyuda xodimga ko'rinmaydi, lekin manzilni qo'lda yozsa shu yerda to'xtaydi
// (bu faqat interfeys himoyasi, haqiqiy himoya backendda bo'lishi kerak).
const Reports = () => {
     const outlet = useOutletContext()
     if (outlet?.user?.role !== "owner") {
          return <Empty>
               <h2>Bu bo'lim faqat ega uchun</h2>
               <p>Hisobotlarni ko'rish uchun ega sifatida kiring.</p>
          </Empty>
     }
     return <OwnerReports />
}

export default Reports