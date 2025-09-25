import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import {router} from './App';
import './index.css'
import AuthProvider from './context/authContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <AuthProvider>
      <RouterProvider router={router}  />
    </AuthProvider>
  </StrictMode>,
)
