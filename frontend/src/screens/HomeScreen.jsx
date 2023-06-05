// @ts-nocheck
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../redux/slices/loginSlice";

export default function HomeScreen() {
  const { isLoggedIn } = useSelector(state => state.logger);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })

      const data = await response.json();

      if (response.ok) {
        dispatch(logoutUser());
        toast.success("Logged out Successfully");
        navigate("/");
      }
      else {
        toast.error(data.message);
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div>HomeScreen</div>
      {
        isLoggedIn ?
          <>
            <div><Link to='/profile'><button>Profile</button></Link></div>
            <button onClick={logout}>Logout</button>
          </> :
          <>
            <div><Link to='/login'><button>Sign In</button></Link></div>
            <div><Link to='/register'><button>Sign Up</button></Link></div>
          </>
      }
    </>
  )
}
