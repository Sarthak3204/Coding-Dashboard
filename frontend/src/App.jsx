import { Outlet } from 'react-router-dom'
import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <>
      <NavBar />
      <ToastContainer
        autoClose={700}
        pauseOnFocusLoss={false}
        transition={Flip}
        hideProgressBar={true}
        pauseOnHover={false}
      />
      <Outlet />
    </>
  )
}