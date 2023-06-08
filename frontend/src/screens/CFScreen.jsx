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
import Filters from '../components/Filters';

export default function CodeforcesScreen() {
  const dispatch = useDispatch();

  const [cfhandle, setCfHandle] = useState("");
  const [myData, setMyData] = useState([{}]);
  const { handle } = myData[0];

  const [filters, setFilters] = useState({ ok: false, wrong: false, rte: false, minRating: 800, maxRating: 3500 });

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

  function filterSubmission(e) {
    const { ok, wrong, rte, minRating, maxRating } = filters;

    const filteredSumbission = myUnfilteredSumbmission.filter(prob => {
      const { verdict, rating } = prob;
      if (rating !== undefined
        &&
        ((!ok && !wrong && !rte)
          || (verdict === "OK" && ok)
          || (verdict === "WRONG_ANSWER" && wrong)
          || (verdict === "RUNTIME_ERROR" && rte))
        &&
        (minRating <= rating && rating <= maxRating)) return prob;
    });

    setMyFilteredSumbmission(filteredSumbission);
  }

  return (
    <>
      <Container>
        <Row className='mt-3'>
          <Col>
            <div className="d-flex gap-3">
              <input
                type="text"
                value={cfhandle}
                onChange={e => setCfHandle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter")
                    handleSubmit();
                }}
                placeholder="Handle"
              />
              <Button variant="primary" onClick={handleSubmit}>Search</Button>
              {myUnfilteredSumbmission.length ?
                <Filters filters={filters} setFilters={setFilters} filterSubmission={filterSubmission} /> : <></>}
            </div>
          </Col>
        </Row>
      </Container>
      {
        myUnfilteredSumbmission.length ?
          <>
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
          </> : <></>
      }
    </>
  )
}