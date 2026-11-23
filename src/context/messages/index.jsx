import { createContext, useContext, useReducer } from "react";
import reducer from "./reducer";

const Message = createContext()

export const MessageData = ()=> useContext(Message)

const MessageContext = ({children})=> {
     const data = useReducer(reducer, null)
     return <Message.Provider value={data}>{children}</Message.Provider>
}

export default MessageContext