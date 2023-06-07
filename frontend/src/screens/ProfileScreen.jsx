import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Contest from '../components/Contest'

export default function ProfileScreen() {
  return (
    <>
      <div>ProfileScreen</div>
      <div>
        <Link to='/profile/codeforces'>
          Codeforces
        </Link>
        <br />
        <Link to='/profile/codechef'>
          Codechef
        </Link>
      </div>
      <Contest />
      <Outlet />
    </>
  )
}
