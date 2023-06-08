// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useRegisterMutation } from '../redux/slices/userApiSlice';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';

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
      navigate('/contest');
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
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={handleSumbit}>

        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confPass}
            onChange={(e) => setConfPass(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>Register</Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account? <Link to='/login'>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}
