import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'

export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomeScreen />}></Route>
        <Route path='/login' element={<LoginScreen />}></Route>
        <Route path='/register' element={<RegisterScreen />}></Route>
        <Route path='/profile' element={<ProfileScreen />}></Route>
      </Routes>
      <ToastContainer />
    </>
  )
}