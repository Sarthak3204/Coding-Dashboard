import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <>
      <NavBar />
      <ToastContainer
        autoClose={400}
        pauseOnFocusLoss={false}
        hideProgressBar={true}
        pauseOnHover={false}
      />
      <Outlet />
    </>
  )
}