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
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';

export default function CodeforcesScreen() {
  const dispatch = useDispatch();

  const [cfhandle, setCfHandle] = useState("");
  const [myData, setMyData] = useState([{}]);
  const { handle } = myData[0];

  const [filters, setFilters] = useState({ ok: false, wrong: false, rte: false, minRating: 800, maxRating: 3500 });

  const [myUnfilteredSumbmission, setMyUnfilteredSumbmission] = useState([]);
  const [myFilteredSumbmission, setMyFilteredSumbmission] = useState([]);

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(50);
  const [pageList, setPageList] = useState([0])
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

  useEffect(() => {
    const total = Math.ceil(myFilteredSumbmission.length / perPage);
    const arr = [];

    for (let i = 0; i < total; i++)
      arr.push(i);

    setPageList(arr);
  }, [myFilteredSumbmission.length, perPage])

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
            </div>
          </Col>
        </Row>
      </Container>
      {
        (myUnfilteredSumbmission.length > 0) &&
        <>
          <Container>
            <Row className="justify-content-between text-center gap-2 mt-3" md="auto" >
              <Col><Filters filters={filters} setFilters={setFilters} filterSubmission={filterSubmission} /></Col>
              <Col>
                <Row xs="auto">
                  <Col className="d-flex">
                    <span className="pt-1">Jump to page:</span>
                    <Dropdown className='mx-2'>
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {page + 1}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="text-center">
                        {pageList.map(pageNo =>
                          <Dropdown.Item key={pageNo} onClick={() => setPage(pageNo)}>{pageNo + 1}</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col className="d-flex">
                    <span className="pt-1">Rows per page:</span>
                    <Dropdown className='mx-2'>
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {perPage}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="text-center" >
                        {[50, 100, 200].map(cnt => <Dropdown.Item onClick={() => setPerPage(cnt)}>{cnt}</Dropdown.Item>)}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col className="pt-1">
                    {page * perPage + 1}-{Math.min((page + 1) * perPage, myFilteredSumbmission.length)} of {myFilteredSumbmission.length}
                  </Col>
                  {page > 0 &&
                    <Col className="pt-1">
                      <BsArrowLeft size={24} style={{ cursor: "pointer" }} onClick={() => setPage(p => p - 1)} />
                    </Col>}
                  {(page + 1) * perPage < myFilteredSumbmission.length &&
                    <Col className="pt-1">
                      <BsArrowRight size={24} style={{ cursor: "pointer" }} onClick={() => setPage(p => p + 1)} />
                    </Col>}
                </Row>
              </Col>
            </Row>

            <Row className="justify-content-center mt-3">
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
                      myFilteredSumbmission.slice(page * perPage, (page + 1) * perPage).map(({ id, name, tags, verdict, rating, url }) =>
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
          </Container >
        </>
      }
    </>
  )
}