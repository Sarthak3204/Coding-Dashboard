// @ts-nocheck
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRemoveUserMutation, useUpdateUserMutation } from "../redux/slices/userApiSlice";
import { setCredentials, removeCredentials } from "../redux/slices/authSlice";
import { setCodeforces, removeCodeforces } from "../redux/slices/codeforcesSlice";
import { setAtcoder, removeAtcoder } from "../redux/slices/atcoderSlice";
import { Form, Button } from "react-bootstrap";
import { Col, Container, Row, Table } from "react-bootstrap";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");

  const [cfhandle, setCfHandle] = useState("");
  const [achandle, setAcHandle] = useState("");
  const [cfData, setCfData] = useState([]);
  const [acData, setAcData] = useState([]);

  const [updateUser] = useUpdateUserMutation();
  const [removeUser] = useRemoveUserMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { cfInfo } = useSelector((state) => state.codeforces);
  const { acInfo } = useSelector((state) => state.atcoder);

  useEffect(() => {
    if (cfInfo) {
      loadCfUser();
      setCfHandle(cfInfo.handle);
    }
  }, [cfInfo]);

  useEffect(() => {
    if (acInfo) {
      loadAcUser();
      setAcHandle(acInfo.handle);
    }
  }, [acInfo]);

  function handleSubmitCF() {
    loadCfUser();
    dispatch(setCodeforces({ handle: cfhandle }));
  }

  function handleSubmitAC() {
    loadAcUser();
    dispatch(setAtcoder({ handle: achandle }));
  }

  async function loadCfUser() {
    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.info?handles=${cfInfo ? cfInfo.handle : cfhandle}`
      );

      const data = response.data.result.map((detail) => {
        return {
          handle: detail.handle,
          rating: detail.rating,
          rank: detail.rank,
          maxRating: detail.maxRating,
          maxRank: detail.maxRank,
        };
      });

      setCfData(data);
    } catch (error) {
      toast.error("Handle not found");
      console.error(error);
    }
  }

  async function loadAcUser() {
    try {
      const response = await axios.get(
        `https://kenkoooo.com/atcoder/atcoder-api/v3/user_info?user=${acInfo ? acInfo.handle : achandle}`
      );

      const detail = response.data;
      const data = {
        handle: detail.user_id,
        acc_count: detail.accepted_count,
        acc_count_rank: detail.accepted_count_rank,
        rated_point_sum: detail.rated_point_sum,
        rated_point_sum_rank: detail.rated_point_sum_rank,
      };

      setAcData(data);
    } catch (error) {
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
      specialChar: /[^\w\s]/.test(password),
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
    if (password !== confPass) return toast.error("Passwords do not match");

    try {
      const res = await updateUser({
        _id: userInfo._id,
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Update Successful");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  async function handleDelete(e) {
    e.preventDefault();
    try {
      const res = await removeUser().unwrap();
      toast.success("User deleted successfully");
      dispatch(removeCredentials());
      dispatch(removeCodeforces());
      dispatch(removeAtcoder())
      navigate('/');
    }
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <Container>
      <Row
        className="justify-content-between mt-5"
        style={{ marginBottom: "30px" }}
      >
        <Col xs={12} md={5} className="card p-3" style={{ width: "45%" }}>
          <Row className="d-flex">
            <Col>
              <h2>CodeForces</h2>
            </Col>
            <Col>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  value={cfhandle}
                  onChange={(e) => setCfHandle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitCF();
                  }}
                  placeholder="Handle"
                />
                <Button variant="primary" onClick={handleSubmitCF}>
                  Search
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Table striped bordered hover className="text-center">
                <tbody>
                  <tr key="0">
                    <th style={{ width: "50%" }}>Handle</th>
                    <td>{cfData.length > 0 && cfData[0].handle}</td>
                  </tr>
                  <tr key="1">
                    <th>Rating</th>
                    <td>{cfData.length > 0 && cfData[0].rating}</td>
                  </tr>
                  <tr key="2">
                    <th>Rank</th>
                    <td>{cfData.length > 0 && cfData[0].rank}</td>
                  </tr>
                  <tr key="3">
                    <th>Max Rating</th>
                    <td>{cfData.length > 0 && cfData[0].maxRating}</td>
                  </tr>
                  <tr key="4">
                    <th>Max Rank</th>
                    <td>{cfData.length > 0 && cfData[0].maxRank}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>

        <Col xs={12} md={5} className="card p-3" style={{ width: "45%" }}>
          <Row className="d-flex">
            <Col>
              <h2>AtCoder</h2>
            </Col>
            <Col>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  value={achandle}
                  onChange={(e) => setAcHandle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitAC();
                  }}
                  placeholder="Handle"
                />
                <Button variant="primary" onClick={handleSubmitAC}>
                  Search
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Table striped bordered hover className="text-center">
                <tbody>
                  <tr key="0">
                    <th style={{ width: "50%" }}>Handle</th>
                    <td>{acData.handle}</td>
                  </tr>
                  <tr key="1">
                    <th>Accepted Count</th>
                    <td>{acData.acc_count}</td>
                  </tr>
                  <tr key="2">
                    <th>Accepted Count Rank</th>
                    <td>{acData.acc_count_rank}</td>
                  </tr>
                  <tr key="3">
                    <th>Rated Point Sum</th>
                    <td>{acData.rated_point_sum}</td>
                  </tr>
                  <tr key="4">
                    <th>Rated Point Sum Rank</th>
                    <td>{acData.rated_point_sum_rank}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <Col xs={12} md={5} className="card p-3">
          <h2>Update User</h2>
          <Form onSubmit={handleSumbit}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder={userInfo.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder={userInfo.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isValid={validateEmail()}
                isInvalid={email.length > 0 && !validateEmail()}
              ></Form.Control>

              <Form.Control.Feedback type="invalid">
                Enter valid email address
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid"></Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
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
              <Form.Control.Feedback type="valid"></Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="my-2" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confPass}
                onChange={(e) => setConfPass(e.target.value)}
                isValid={confPass.length > 0 && password === confPass}
                isInvalid={confPass.length > 0 && password !== confPass}
              ></Form.Control>

              <Form.Control.Feedback type="invalid">
                Passwords do not match
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid"></Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2">Update</Button>
            <Button variant="danger" className="mx-2 mt-2" onClick={handleDelete}>Delete</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
