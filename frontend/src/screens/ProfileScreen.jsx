import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function ProfileScreen() {
  return (
    <>
      <div>ProfileScreen</div>
      <div>
        <Link to='/profile/codeforces'>
          Codeforces
        </Link>
      </div>
      <Outlet />
    </>
  )
}
