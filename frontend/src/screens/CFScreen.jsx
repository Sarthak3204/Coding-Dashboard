// @ts-nocheck
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCodeforces } from '../redux/slices/codeforcesSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { } from 'react-bootstrap/ModalHeader';
import Filters from '../components/Filters';

export default function CodeforcesScreen() {
  const dispatch = useDispatch();

  const [cfhandle, setCfHandle] = useState("");
  const [myData, setMyData] = useState([{}]);
  const { handle, rating, rank, maxRating, maxRank } = myData[0];

  const [filters, setFilters] = useState({ ok: false, wrong: false, minRating: 800, maxRating: 3500 });

  const [myUnfilteredSumbmission, setMyUnfilteredSumbmission] = useState([]);
  const [myFilteredSumbmission, setMyFilteredSumbmission] = useState([]);

  const { cfInfo } = useSelector((state) => state.codeforces);

  useEffect(() => {
    if (cfInfo) {
      if (cfhandle === "")
        setCfHandle(cfInfo.handle);
      else loadUser();
    }
  }, [cfInfo])

  useEffect(() => {
    if (handle !== undefined)
      loadSubmission();
  }, [handle])

  useEffect(() => {
    if (myUnfilteredSumbmission.length)
      filterSubmission();
  }, [myUnfilteredSumbmission])

  function handleSubmit() {
    dispatch(setCodeforces({ handle: cfhandle }));
  }

  async function loadUser() {
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${cfhandle}`);
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

  async function loadSubmission() {
    try {
      const response = await axios.get(`https://codeforces.com/api/user.status?handle=${cfhandle}&from=1&count=1000`);

      const unfilteredSumbission = response.data.result.map(prob => {
        return {
          id: prob.id,
          name: prob.problem.name,
          tags: prob.problem.tags,
          verdict: prob.verdict,
          rating: prob.problem.rating,
          url: `https://codeforces.com/contest/${prob.contestId}/submission/${prob.id}`,
        }
      });

      setMyUnfilteredSumbmission(unfilteredSumbission);
    }
    catch (error) {
      console.error(error);
    }
  }

  function filterSubmission() {
    const filteredSumbission = myUnfilteredSumbmission.filter(prob => {
      if (prob.rating !== undefined
        &&
        ((!filters.ok && !filters.wrong) || (prob.verdict === "OK" && filters.ok) || (prob.verdict === "WRONG_ANSWER" && filters.wrong))
        &&
        (filters.minRating <= prob.rating && prob.rating <= filters.maxRating)) {
        return prob;
      }
    });

    setMyFilteredSumbmission(filteredSumbission);
  }

  function handleOk(e) {
    if (filters.wrong)
      e.preventDefault();
    else {
      setFilters(prev => {
        return {
          ...prev, ok: !prev.ok
        }
      })
    }
  }

  function handleWrong(e) {
    if (filters.ok)
      e.preventDefault();
    else {
      setFilters(prev => {
        return {
          ...prev, wrong: !prev.wrong
        }
      })
    }
  }

  function handleMinRating(e) {
    setFilters(prev => {
      return {
        ...prev, minRating: Math.max(800, e.target.value)
      }
    })
  }

  function handleMaxRating(e) {
    setFilters(prev => {
      return {
        ...prev, maxRating: Math.min(3500, e.target.value)
      }
    })
  }

  return (
    <>
      <Container>
        <Row className='justify-content-center mt-3'>
          <Col>
            <div className="d-flex gap-3">
              <h3>Handle</h3>
              <input
                type="text"
                value={cfhandle}
                onChange={e => setCfHandle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter")
                    handleSubmit();
                }}
              />
              <Button variant="primary" onClick={handleSubmit}>Search</Button>
            </div>
          </Col>
        </Row>
      </Container>
      <br />
      {
        cfhandle !== ""
          ?
          <div className="">
            {handle}<br />{rating}<br />{rank}<br />{maxRating}<br />{maxRank}<br />
          </div>
          : <></>
      }
      {
        myUnfilteredSumbmission.length ?
          <>
            <div>
              Filters
              <label htmlFor="minRating">Min Rating</label>
              <input type="number" id="minRating" onChange={handleMinRating} />
              <br />
              <label htmlFor="maxRating">Max Rating</label>
              <input type="number" id="maxRating" onChange={handleMaxRating} />
            </div>
            <Container>
              <Row>
                <Col>
                  <div className="d-flex gap-4">
                    <Form.Check
                      type='checkbox'
                      label='Accepted'
                      onClick={handleOk}
                    />
                    <Form.Check
                      type='checkbox'
                      label='Wrong Answer'
                      onClick={handleWrong}
                    />
                    <Button variant="primary" onClick={filterSubmission}>Apply</Button>
                  </div>
                </Col>
              </Row>
            </Container>
            <Filters />
            <Container>
              <Row className="justify-content-center mt-5">
                <Col>
                  <Table striped bordered hover className="text-center">
                    <thead>
                      <tr className="text-center">
                        <th>ID</th>
                        <th>NAME</th>
                        <th>TAGS</th>
                        <th>VERDICT</th>
                        <th>RATING</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        myFilteredSumbmission.map(({ id, name, tags, verdict, rating, url }) =>
                          <tr key={id}>
                            <td><Link to={url} target="_blank" rel="noopener noreferrer">{id}</Link></td>
                            <td>{name}</td>
                            <td>{tags.join(" ")}</td>
                            <td>{verdict}</td>
                            <td>{rating}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </>
          : <></>
      }
    </>
  )
}