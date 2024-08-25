import React, { useState, useEffect } from "react";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { deliverOrder, getOrderDetails, payOrder } from "../actions/orderActions";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePayment from "../components/StripePayment";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51PqL1Z02rHjAqjmEn8SGrYwZhU9sExQy9pnwhP5K8RghLXYlBAqpdfQgDdNobiKTGFrODVx1tTgY6VxklIbmTwTt00uyPCH4cy");

function extractDateTime(dateTime) {
  const date = dateTime.substring(0,10).split("-").reverse().join('/')
  const time = dateTime.substring(11,19)
  return date + ' '  + time
} 

function OrderScreen() {
  const orderId = useParams().id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;
  console.log(order)

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

// Fetch Order Details
useEffect(() => {
  if (!userInfo) {
    navigate('/login');
    return;
  }
  
  if (!order || successPay || successDeliver || order._id !== Number(orderId)) {
    dispatch({ type: ORDER_PAY_RESET });
    dispatch({ type: ORDER_DELIVER_RESET });
    dispatch(getOrderDetails(orderId));
  }
}, [dispatch, orderId, userInfo, order, successPay, successDeliver, navigate]);

// Handle Payment Intent from URL
useEffect(() => {
  if (!userInfo) {
    navigate('/login');
    return;
  }

  const query = new URLSearchParams(window.location.search);
  const paymentIntentIdFromUrl = query.get('payment_intent');
  const paymentIntentClientSecretFromUrl = query.get('payment_intent_client_secret');

  if (paymentIntentIdFromUrl && paymentIntentClientSecretFromUrl) {
    const handlePaymentIntent = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        await axios.post('/api/orders/verify-payment/', {
          paymentIntentId: paymentIntentIdFromUrl,
          clientSecret: paymentIntentClientSecretFromUrl,
          orderId: orderId,
        }, config);

        // Reload order details after payment verification
        dispatch(getOrderDetails(orderId));
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };
    handlePaymentIntent();
  }
}, [dispatch, orderId, userInfo, navigate]);

// Fetch Client Secret
useEffect(() => {
  if (!userInfo) {
    navigate('/login');
    return;
  }
  
  if (order && !order.isPaid && clientSecret === "") {
    const getClientSecret = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`/api/orders/create-payment-intent/`, {
        currency: "eur",
        orderId: orderId,
      }, config);
      setClientSecret(data.clientSecret);
    };
    getClientSecret();
  }
}, [order, clientSecret, userInfo, navigate]);

  const successPaymentHandler = (paymentResult) => {
    console.log("Payment result : ", paymentResult)
    // dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      {/* <h1>Order: {order._id}</h1> */}
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.shippingAddress.name}
                <br />
                <strong>Email: </strong>
                {order.user.email}
                <br />
                {order.shippingAddress.address}, {order.shippingAddress.city}
                <br />
                {order.shippingAddress.postcode}
                <br />
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">Delivered on {extractDateTime(order.deliveredAt)}</Message>
              ) : (
                <Message variant="warning">Not delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment</h2>
              {/* <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p> */}
              {order.isPaid ? (
                <Message variant="success">Paid on {extractDateTime(order.paidAt)}</Message>
              ) : (
                <Message variant="warning">Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Your order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                          {item.qty} X &euro;{item.price} ={" "}
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
                  <Col>&euro;{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>&euro;{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>&euro;{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && clientSecret && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      amount={order.totalPrice * 100}
                      currency="eur"
                      clientSecret={clientSecret} // Pass the clientSecret here
                      onSuccess={successPaymentHandler}
                    />
                  </Elements>
                </ListGroup.Item>
              )}
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn btn-block"
                  onClick={deliverHandler}
                >
                  Mark as delivered
                </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
