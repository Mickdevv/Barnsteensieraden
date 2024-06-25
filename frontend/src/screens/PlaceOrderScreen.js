import React, { useState, useEffect } from "react";
import { redirect, useLocation, useNavigate, Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

function PlaceOrderScreen() {
  const cart = useSelector((state) => state.cart);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
    </div>
  );
}

export default PlaceOrderScreen;
