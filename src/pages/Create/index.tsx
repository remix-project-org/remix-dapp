import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Form
      onSubmit={(e: any) => {
        e.preventDefault();
        navigate(`/?address=${e.target[0].value}&abi=${e.target[1].value}`);
      }}
    >
      <Form.Group className="mb-3" controlId="formAddress">
        <Form.Label>contract address</Form.Label>
        <Form.Control type="address" placeholder="Enter address" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formAbi">
        <Form.Label>contract abi</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          type="abi"
          placeholder="Enter abi"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default HomePage;
