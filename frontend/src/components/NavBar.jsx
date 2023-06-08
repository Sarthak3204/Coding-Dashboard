// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { removeCredentials } from '../redux/slices/authSlice';
import { useLogoutMutation } from '../redux/slices/userApiSlice';
import { removeCodeforces } from '../redux/slices/codeforcesSlice';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { SiCodeforces, SiCodechef } from 'react-icons/si';
import { RiMacbookLine } from 'react-icons/ri';
import { CgLogOut } from 'react-icons/cg';
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { pathname } = location;

  const [brand, setBrand] = useState("Coding Dashboard");

  const [logout] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout().unwrap();

      dispatch(removeCredentials());
      dispatch(removeCodeforces());

      setBrand("Coding Dashboard");
      navigate('/');
      toast.success("Logout Successful");
    }
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (pathname === "/codeforces") setBrand("CodeForces");
    else if (pathname === "/codechef") setBrand("CodeChef");
    else if (pathname === "/contest") setBrand("Upcoming Contest")
  }, [pathname])

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>{brand}</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>

                    <LinkContainer to='/contest'>
                      <NavDropdown.Item>
                        <RiMacbookLine /> Contest
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/codeforces'>
                      <NavDropdown.Item>
                        <SiCodeforces /> Codeforces
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/codechef'>
                      <NavDropdown.Item>
                        <SiCodechef /> codechef
                      </NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={handleLogout}>
                      <CgLogOut /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>Sign In</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>Sign Up</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
