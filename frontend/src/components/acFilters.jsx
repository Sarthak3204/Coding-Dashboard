import React from "react";
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { LuFilter } from "react-icons/lu";

function Filters({ filters, setFilters, filterSubmission }) {
  const { ok, wrong, rte } = filters;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleOk(e) {
    setFilters((prev) => {
      return {
        ...prev,
        ok: e.target.checked,
        wrong: false,
        rte: false,
      };
    });
  }

  function handleWrong(e) {
    setFilters((prev) => {
      return {
        ...prev,
        wrong: e.target.checked,
        ok: false,
        rte: false,
      };
    });
  }

  function handleRte(e) {
    setFilters((prev) => {
      return {
        ...prev,
        rte: e.target.checked,
        ok: false,
        wrong: false,
      };
    });
  }

  return (
    <>
      <LuFilter size={32} style={{ cursor: "pointer" }} onClick={handleShow} />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <div className="d-flex justify-content-around">
                  <Form.Check
                    type={"checkbox"}
                    checked={ok}
                    onChange={handleOk}
                    label="Accepted"
                  />
                  <Form.Check
                    type={"checkbox"}
                    checked={wrong}
                    onChange={handleWrong}
                    label="Wrong Answer"
                  />
                  <Form.Check
                    type={"checkbox"}
                    checked={rte}
                    onChange={handleRte}
                    label="Run Time Error"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              filterSubmission();
            }}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Filters;
