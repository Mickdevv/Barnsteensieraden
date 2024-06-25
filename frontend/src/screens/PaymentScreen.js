import React, { useState, useEffect } from "react";
import { redirect, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

function PaymentScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  if (!shippingAddress.address) {
    navigate("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or credit card"
              id="paypal"
              name="paymentMethod"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod("PayPal")}></Form.Check>
            <Form.Check
              type="radio"
              label="Ideal"
              id="ideal"
              name="paymentMethod"
              checked={paymentMethod === "Ideal"}
              onChange={(e) => setPaymentMethod("Ideal")}></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
