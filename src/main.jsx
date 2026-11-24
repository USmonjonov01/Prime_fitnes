import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './root'
import { BrowserRouter } from 'react-router-dom'
import NotificationContext from './context/notifications'
import MessageContext from './context/messages'
import AdminContext from './context/admins'
import ClientContext from './context/clients'

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <AdminContext>
        <ClientContext>
          <NotificationContext>
            <MessageContext>
              <Root />
            </MessageContext>
          </NotificationContext>
        </ClientContext>
      </AdminContext>
    </BrowserRouter>
  </>,
)
