import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './root'
import { BrowserRouter } from 'react-router-dom'
import NotificationContext from './context/notifications'

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <NotificationContext>
        <Root />
      </NotificationContext>
    </BrowserRouter>
  </>,
)
