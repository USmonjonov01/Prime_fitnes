import { createContext, useContext, useReducer } from "react"
import reducer from "./reducer"

const Admin = createContext()

export const AdminData = () => useContext(Admin)

const AdminContext = ({ children }) => {
     const data = useReducer(reducer, null)
     return <Admin.Provider value={data}>{children}</Admin.Provider>
}

export default AdminContext