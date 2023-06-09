import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Contest() {
  const [myData, setMyData] = useState([]);

  async function loadContest() {
    const response = await axios.get("https://kontests.net/api/v1/all");

    const data = response.data
      .filter((contest) => {
        if (
          contest.site === "CodeForces" ||
          contest.site === "CodeChef" ||
          contest.site == "AtCoder"
        ) {
          return contest;
        }
      })
      .map((contest) => {
        return {
          id: crypto.randomUUID(),
          name: contest.name,
          platform: contest.site,
          startTime: format(new Date(contest.start_time), "dd/MM/yyyy hh:mm a"),
          endTime: format(new Date(contest.end_time), "dd/MM/yyyy hh:mm a"),
          url: contest.url,
        };
      });

    setMyData(data);
  }

  useEffect(() => {
    loadContest();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col>
          <Table striped bordered hover className="text-center">
            <thead>
              <tr className="text-center">
                <th style={{ width: "50%" }}>CONTEST</th>
                <th>PLATFORM</th>
                <th>START TIME</th>
                <th>END TIME</th>
              </tr>
            </thead>
            <tbody>
              {myData.map(({ id, name, platform, startTime, endTime, url }) => (
                <tr key={id}>
                  <td>
                    <Link to={url} target="_blank" rel="noopener noreferrer">
                      {name}
                    </Link>
                  </td>
                  <td>{platform}</td>
                  <td>{startTime}</td>
                  <td>{endTime}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
