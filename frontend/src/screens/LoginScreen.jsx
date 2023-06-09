// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useLoginMutation } from '../redux/slices/userApiSlice';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/contest');
    }
  }, [userInfo]);

  function isStrongPassword() {
    // Perform password strength validation here
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[^\w\s]/.test(password)
    };

    return Object.values(conditions).every((condition) => condition);
  };

  function validateEmail() {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (!validateEmail())
      return toast.error("Invalid email address");
    if (!isStrongPassword(password))
      return toast.error("Password is not strong");
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
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={handleSumbit}>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isValid={validateEmail()}
            isInvalid={email.length > 0 && !validateEmail()}
          ></Form.Control>

          <Form.Control.Feedback type="invalid">
            Enter valid email address
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
          </Form.Control.Feedback>

        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isValid={isStrongPassword()}
            isInvalid={password.length > 0 && !isStrongPassword()}
          ></Form.Control>

          <Form.Control.Feedback type="invalid">
            <div>
              <strong>Your Password must contain:</strong>
              <ul>
                <li>Atleast 8 characters</li>
                <li>Atleast one uppercase and one lowercase</li>
                <li>Atleast one number and special character</li>
              </ul>
            </div>
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
          </Form.Control.Feedback>

        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>Sign In</Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New User? <Link to='/register'>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}
