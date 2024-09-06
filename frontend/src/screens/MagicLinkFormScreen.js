import React, { useState, useEffect } from "react";
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import { requestMagicLink } from '../actions/userActions'
import Loader from "../components/Loader";
import Message from "../components/Message";

function MagicLinkFormScreen() {

    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const status = useSelector((state) => state.userRequestMagicLink);
    const { error, loading, success } = status;
    

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(email)
        dispatch(requestMagicLink(email))
    }
  return (
    <div>
        <p>{loading}</p>
        <p>{success}</p>
        <p>{error}</p>
        {loading && <Loader />}
        {success && <Message variant="success">Email sent successfully</Message>}
        {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
            required
            type="email"
            placeholder="name@domain.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type="submit" className="my-2">Submit</Button>
      </Form>
    </div>
  )
}

export default MagicLinkFormScreen
