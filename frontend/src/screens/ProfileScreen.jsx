// @ts-nocheck
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../redux/slices/userApiSlice'
import { setCredentials } from '../redux/slices/authSlice';
import { Form, Button } from 'react-bootstrap';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { setCodeforces } from '../redux/slices/codeforcesSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");

  const [cfhandle, setCfHandle] = useState("");
  const [myData, setMyData] = useState([]);

  const [updateUser] = useUpdateUserMutation();
  const { userInfo } = useSelector(state => state.auth);
  const { cfInfo } = useSelector((state) => state.codeforces);

  useEffect(() => {
    if (cfInfo) {
      loadUser();
      setCfHandle(cfInfo.handle);
    }
  }, [])

  function handleSubmitCF() {
    loadUser();
    dispatch(setCodeforces({ handle: cfhandle }));
  }

  async function loadUser() {
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${cfInfo ? cfInfo.handle : cfhandle}`);
      const data = response.data.result.map(detail => {
        return {
          handle: detail.handle,
          rating: detail.rating,
          rank: detail.rank,
          maxRating: detail.maxRating,
          maxRank: detail.maxRank,
        }
      });

      setMyData(data);
    }
    catch (error) {
      toast.error("Handle not found");
      console.error(error);
    }
  }

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
  }

  function validateEmail() {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (email.length > 0 && !validateEmail())
      return toast.error("Invalid email address");
    if (password.length > 0 && !isStrongPassword(password))
      return toast.error("Password is not strong");
    if (password !== confPass)
      return toast.error("Passwords do not match");

    try {
      const res = await updateUser({ _id: userInfo._id, name, email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Update Successful");
    }
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <Container>
      <Row className='justify-content-between mt-5'>
        <Col xs={12} md={5} className='card p-3'>

          <h2>Update User</h2>
          <Form onSubmit={handleSumbit}>

            <Form.Group className='my-2' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder={userInfo.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder={userInfo.email}
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
                    <li>Atleast one digit and one special character</li>
                  </ul>
                </div>
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
              </Form.Control.Feedback>

            </Form.Group>

            <Form.Group className='my-2' controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confPass}
                onChange={(e) => setConfPass(e.target.value)}
                isValid={confPass.length > 0 && password === confPass}
                isInvalid={confPass.length > 0 && password !== confPass}
              ></Form.Control>

              <Form.Control.Feedback type="invalid">
                Passwords do not match
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
              </Form.Control.Feedback>

            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>Update</Button>
          </Form>
        </Col>
        <Col xs={12} md={5} className='card p-3'>
          <Row className='d-flex'>
            <Col>
              <h2>Codeforces</h2>
            </Col>
            <Col>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  value={cfhandle}
                  onChange={e => setCfHandle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter")
                      handleSubmitCF();
                  }}
                  placeholder="Handle"
                />
                <Button variant="primary" onClick={handleSubmitCF}>Search</Button>
              </div>
            </Col>
          </Row>
          {myData.length > 0 &&
            <Row className='mt-4'>
              <Col>
                <Table striped bordered hover className="text-center">
                  <tbody>
                    <tr key="0">
                      <th>Handle</th>
                      <td>{myData[0].handle}</td>
                    </tr>
                    <tr key="1">
                      <th>Rating</th>
                      <td>{myData[0].rating}</td>
                    </tr>
                    <tr key="2">
                      <th>Rank</th>
                      <td>{myData[0].rank}</td>
                    </tr>
                    <tr key="3">
                      <th>Max Rating</th>
                      <td>{myData[0].maxRating}</td>
                    </tr>
                    <tr key="4">
                      <th>Max Rank</th>
                      <td>{myData[0].maxRank}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          }
        </Col>
      </Row>
    </Container>
  )
}
