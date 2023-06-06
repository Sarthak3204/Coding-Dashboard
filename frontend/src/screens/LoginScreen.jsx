// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useLoginMutation } from '../redux/slices/userApiSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo]);

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials(res));
      navigate('/');
      toast.success("Login Successful");
    }
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <form onSubmit={handleSumbit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            id='email'
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            onChange={e => setPass(e.target.value)}
            value={password}
            id='password'
          />
          <br />
          <button type="submit">Log In</button>
        </div>
      </form>
    </>
  )
}
