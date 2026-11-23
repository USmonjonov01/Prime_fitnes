import { useOutletContext } from "react-router-dom"
import { Card, Note, Title } from "./style"

// Mijoz profili: hozircha faqat ko'rish. Tahrirlash backend ulangach qo'shiladi.
const Profile = () => {
     const user = useOutletContext()?.user

     const rows = [
          ["Ism va familiya", user?.full_name],
          ["Telefon raqami", user?.phone_number],
     ].filter(([, value]) => value)

     return <>
          <Title>Profil</Title>
          <Card>
               {rows.map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
               ))}
          </Card>
          {user?.code && <Note>Zalga kirganda kodingizni ayting: <strong>{user.code}</strong></Note>}
     </>
}

export default Profile
