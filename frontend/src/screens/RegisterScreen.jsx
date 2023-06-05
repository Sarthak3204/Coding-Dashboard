import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("")
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (password !== confPass) {
      toast.error("Password and confirm password do not match");
    }

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, email, password
        })
      })

      const data = await response.json();
      if (response.ok) {
        toast.success("Registration Successful");
        navigate("/login");
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
