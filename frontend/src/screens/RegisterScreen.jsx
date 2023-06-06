// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useRegisterMutation } from '../redux/slices/userApiSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("")

  const [register] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (password !== confPass) {
      toast.error("Passwords do not matchh");
    }
    else {
      try {
        const res = await register({ name, email, password }).unwrap();

        dispatch(setCredentials(res));
        navigate('/');
        toast.success("Registration Successful");
      }
      catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSumbit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            onChange={e => setName(e.target.value)}
            value={name}
            id='name'
          />
          <br />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            id="email"
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            id="password"
          />
          <br />
          <label htmlFor="confPass">Confirm Password</label>
          <input
            type="password"
            onChange={e => setConfPass(e.target.value)}
            value={confPass}
            id="confPass"
          />
          <br />
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </>
  )
}
