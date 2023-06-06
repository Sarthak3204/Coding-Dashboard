// @ts-nocheck
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { removeCredentials } from '../redux/slices/authSlice';
import { useLogoutMutation } from '../redux/slices/userApiSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout().unwrap();

      dispatch(removeCredentials());
      navigate('/');
      toast.success("Logout Successful");
    }
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div>HomeScreen</div>
      {
        userInfo ?
          <>
            <div><Link to='/profile'><button>Profile</button></Link></div>
            <button onClick={handleLogout}>Logout</button>
          </> :
          <>
            <div><Link to='/login'><button>Sign In</button></Link></div>
            <div><Link to='/register'><button>Sign Up</button></Link></div>
          </>
      }
    </>
  )
}
