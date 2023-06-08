import React from 'react';
import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Filters({ filters, setFilters, filterSubmission }) {
  const { ok, wrong, rte } = filters;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleOk(e) {
    if (wrong || rte)
      e.preventDefault();
    else {
      setFilters(prev => {
        return {
          ...prev,
          ok: e.target.checked
        }
      })
    }
  }

  function handleWrong(e) {
    if (ok || rte)
      e.preventDefault();
    else {
      setFilters(prev => {
        return {
          ...prev,
          wrong: e.target.checked
        }
      })
    }
  }

  function handleRte(e) {
    if (ok || wrong)
      e.preventDefault();
    else {
      setFilters(prev => {
        return {
          ...prev,
          rte: e.target.checked
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
      <Button variant="primary" onClick={handleShow}>Filters</Button>

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
                <div className='d-flex justify-content-around'>
                  <Form.Check
                    type={'checkbox'}
                    checked={ok}
                    onChange={handleOk}
                    label="Accepted"
                  />
                  <Form.Check
                    type={'checkbox'}
                    checked={wrong}
                    onChange={handleWrong}
                    label="Wrong Answer"
                  />
                  <Form.Check
                    type={'checkbox'}
                    checked={rte}
                    onChange={handleRte}
                    label="Run Time Error"
                  />
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <input type="number" onChange={handleMinRating} placeholder="Min Rating" />
                  <input type="number" onChange={handleMaxRating} placeholder="Max Rating" />
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => { handleClose(); filterSubmission(); }}>Apply</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Filters;