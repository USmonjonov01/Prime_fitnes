import { useOutletContext } from "react-router-dom"
import { Card, Title } from "./style"

// Xodim va ega profili: hozircha faqat ko'rish. Tahrirlash backend ulangach qo'shiladi.
const ROLE_LABEL = { staff: "Xodim", owner: "Zal egasi" }

const Profile = () => {
     const user = useOutletContext()?.user

     const rows = [
          ["Ism va familiya", user?.full_name],
          ["Telefon raqami", user?.phone_number],
          ["Lavozim", ROLE_LABEL[user?.role]],
     ].filter(([, value]) => value)

     return <>
          <Title>Profil</Title>
          <Card>
               {rows.map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
               ))}
          </Card>
     </>
}

export default Profile
