import { createContext, useContext, useReducer } from "react";
import reducer from "./reducer";

const Client = createContext()

export const ClientData = () => useContext(Client)

const ClientContext = ({ children }) => {
     const data = useReducer(reducer, null)
     return <Client.Provider value={data}>{children}</Client.Provider>
}

export default ClientContext