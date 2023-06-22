// @ts-nocheck
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row, Table } from "react-bootstrap";
import Filters from "../components/acFilters";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";

export default function ACScreen() {
  const [filters, setFilters] = useState({
    ok: false,
    wrong: false,
    rte: false,
  });

  const [myUnfilteredSumbmission, setMyUnfilteredSumbmission] = useState([]);
  const [myFilteredSumbmission, setMyFilteredSumbmission] = useState([]);

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(50);
  const [pageList, setPageList] = useState([0]);
  const { acInfo } = useSelector((state) => state.atcoder);

  useEffect(() => {
    loadSubmission();
  }, []);

  useEffect(() => {
    if (myUnfilteredSumbmission.length) filterSubmission();
  }, [myUnfilteredSumbmission]);

  async function loadSubmission() {
    try {
      const response = await axios.get(
        `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${acInfo.handle}&from_second=1`
      );

      console.log(response.data);
      const array = response.data.map((prob) => {
        return {
          id: prob.id,
          pid: prob.problem_id,
          result: prob.result,
          time: prob.execution_time,
          url: `https://atcoder.jp/contests/${prob.contest_id}/submissions/${prob.id}`,
          p_url: `https://atcoder.jp/contests/${prob.contest_id}/tasks/${prob.problem_id}`,
          lang: prob.language,
        };
      });

      const unfilteredSumbission = array.reverse();
      setMyUnfilteredSumbmission(unfilteredSumbission);
    } catch (error) {
      console.error(error);
    }
  }

  function filterSubmission() {
    const { ok, wrong, rte } = filters;

    const filteredSumbission = myUnfilteredSumbmission.filter((prob) => {
      const { result } = prob;
      if (
        (!ok && !wrong && !rte) ||
        (result === "AC" && ok) ||
        (result === "WA" && wrong) ||
        (result === "RE" && rte)
      )
        return prob;
    });

    setMyFilteredSumbmission(filteredSumbission);
  }

  useEffect(() => {
    const total = Math.ceil(myFilteredSumbmission.length / perPage);
    const arr = [];

    for (let i = 0; i < total; i++) arr.push(i);

    setPageList(arr);
  }, [myFilteredSumbmission.length, perPage]);

  return (
    <>
      {myUnfilteredSumbmission.length > 0 && (
        <>
          <Container>
            <Row
              className="justify-content-between text-center gap-2 mt-3"
              md="auto"
            >
              <Col>
                <Filters
                  filters={filters}
                  setFilters={setFilters}
                  filterSubmission={filterSubmission}
                />
              </Col>
              <Col>
                <Row xs="auto">
                  <Col className="d-flex">
                    <span className="pt-1">Jump to page:</span>
                    <Dropdown className="mx-2">
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {page + 1}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="text-center">
                        {pageList.map((pageNo) => (
                          <Dropdown.Item
                            key={pageNo}
                            onClick={() => setPage(pageNo)}
                          >
                            {pageNo + 1}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col className="d-flex">
                    <span className="pt-1">Rows per page:</span>
                    <Dropdown className="mx-2">
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {perPage}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="text-center">
                        {[50, 100, 200].map((cnt) => (
                          <Dropdown.Item onClick={() => setPerPage(cnt)}>
                            {cnt}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col className="pt-1">
                    {page * perPage + 1}-
                    {Math.min(
                      (page + 1) * perPage,
                      myFilteredSumbmission.length
                    )}{" "}
                    of {myFilteredSumbmission.length}
                  </Col>
                  {page > 0 && (
                    <Col className="pt-1">
                      <BsArrowLeft
                        size={24}
                        style={{ cursor: "pointer" }}
                        onClick={() => setPage((p) => p - 1)}
                      />
                    </Col>
                  )}
                  {(page + 1) * perPage < myFilteredSumbmission.length && (
                    <Col className="pt-1">
                      <BsArrowRight
                        size={24}
                        style={{ cursor: "pointer" }}
                        onClick={() => setPage((p) => p + 1)}
                      />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>

            <Row className="justify-content-center mt-3">
              <Col>
                <Table striped bordered hover className="text-center">
                  <thead>
                    <tr className="text-center">
                      <th>ID</th>
                      <th>PROBLEM ID</th>
                      <th>RESULT</th>
                      <th>TIME</th>
                      <th>LANGUAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myFilteredSumbmission
                      .slice(page * perPage, (page + 1) * perPage)
                      .map(({ id, pid, result, time, url, p_url, lang }) => (
                        <tr key={id}>
                          <td>
                            <Link
                              to={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {id}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={p_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "darkblue",
                                textDecoration: "none",
                              }}
                            >
                              {pid}
                            </Link>
                          </td>

                          {(() => {
                            if (result === "AC") {
                              return <td>Accepted</td>;
                            } else if (result === "WA") {
                              return <td>Wrong Answer</td>;
                            } else if (result === "TLE") {
                              return <td>Time Limit Exceeded</td>;
                            } else {
                              return <td>Runtime Error</td>;
                            }
                          })()}

                          <td>{time} ms</td>
                          <td>{lang}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
}
