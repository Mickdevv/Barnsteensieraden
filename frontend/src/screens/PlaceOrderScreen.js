import React, { useState, useEffect } from "react";
import { redirect, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

function PlaceOrderScreen() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const location = useLocation();
  const navigate = useNavigate();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 15).toFixed(2);

  cart.totalPrice = (
    Number(cart.itemsPrice) + Number(cart.shippingPrice)
  ).toFixed(2);

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}/`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, navigate, location]);

  if (!cart.paymentMethod) {
    navigate("/payment");
  }

  const placeOrder = () => {

    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Shipping:</strong>
                <br />
                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                <br />
                {cart.shippingAddress.postcode}
                <br />
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            {/* <ListGroup.Item>
              <h2>Payment method</h2>
              <p>
                <strong>Method:</strong>
                <br />
                {cart.paymentMethod}
              </p>
            </ListGroup.Item> */}
            <ListGroup.Item>
              <h2>Order items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} ={" "}
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>{cart.itemsPrice}&euro;</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{cart.shippingPrice}&euro;</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>{cart.totalPrice}&euro;</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              {userInfo ? !userInfo.emailVerified ? <Message variant='info'>You must verify your email before placing an order</Message> :
              
              <ListGroup.Item>
                <Row>
                  <Button
                    type="button"
                    className="btn btn-block"
                    variant="primary"
                    onClick={placeOrder}>
                    Place order
                  </Button>
                </Row>
              </ListGroup.Item>
              : <Message variant='info'>You must be logged in to place an order an order</Message>}
              
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
