import { createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";

const Notification = createContext()

export const NotificationData = () => useContext(Notification)

const NotificationContext = ({ children }) => {
     const data = useReducer(reducer, null)
     return <Notification.Provider value={data}>{children}</Notification.Provider>
     return
}

export default NotificationContext