import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, createProductReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProductScreen() {
  let id = useParams().id;
  let navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const productCreateReview = useSelector((state) => state.productCreateReview);
  const { error: errorReview, loading: loadingReview, success:successReview } = productCreateReview;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successReview) {
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, successReview]);

  const addToCartHandler = () => {
    console.log("Add to cart : ", id);
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(id, {rating: rating, comment: comment}))
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  color={"#f8e825"}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>

              <ListGroup.Item>
                Description : {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price :</Col>
                    <Col>
                      <strong>&euro;{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status :</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <strong>In stock</strong>
                      ) : (
                        <strong>Out of stock</strong>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty :</Col>
                      <Col xs="auto" className="my-1">
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}>
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock <= 0}>
                    Add to cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row className="my-5">
          <Col md={6}>
                <h4>Reviews</h4>
                {product.reviews.length > 0 ? 
                <ListGroup>
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} color='#f8e825'></Rating>
                  <p>{review.createdAt.substring(0,10)}</p>
                  <p>{review.comment}</p>
                  </ListGroup.Item>))}
                  
                  
                </ListGroup>

                 : <Message variant='info'>No reviews for this product yet</Message>
                 }
                 <ListGroup><ListGroup.Item>
                    <h4>Write a review</h4>
                    {loadingReview && <Loader />}
                    {successReview && <Message variant='success'>Review submitted</Message>}
                    {errorReview && <Message variant='danger'>{errorReview}</Message>}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId='rating'>
                          <Form.Label>Rating</Form.Label>
                          <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value=''>Select...</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='comment'>
                          <Form.Label>Review</Form.Label>
                          <Form.Control as='textArea' row={5} value={comment} onChange={(e) => setComment(e.target.value)}>
                          </Form.Control>
                        </Form.Group>
                        <Button type="submit" className=" my-1 btn btn-primary" disabled={loadingReview}>Submit</Button>
                    </Form>
                  ) : (
                    <Message variant='info'><Link to='/login'>Log in</Link> to write a review</Message>
                  )}
                    
                  </ListGroup.Item></ListGroup>
          </Col>
        </Row>
        </div>

      )}
    </div>
  );
}

export default ProductScreen;
