import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './root'
import { BrowserRouter } from 'react-router-dom'
import NotificationContext from './context/notifications'
import MessageContext from './context/messages'

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <NotificationContext>
        <MessageContext>
          <Root />
        </MessageContext>
      </NotificationContext>
    </BrowserRouter>
  </>,
)
