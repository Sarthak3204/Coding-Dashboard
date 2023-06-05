import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginUser } from "../redux/slices/loginSlice";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const handleSumbit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, password
        })
      })

      const data = await response.json();

      if (response.ok) {
        toast.success("Login Successful");
        dispatch(loginUser());
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
