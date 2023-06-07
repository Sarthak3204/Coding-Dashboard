import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';

export default function App() {
  return (
    <>
      {/* <Header /> */}
      <Outlet />
      <ToastContainer />
    </>
  )
}