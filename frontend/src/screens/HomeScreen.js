import React, { useState, useEffect } from "react";
import Product from "../components/Product";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { Row, Col, Dropdown } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductWindow from "../components/ProductWindow";

function HomeScreen() {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  let keyword = location.search;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      <div className="d-flex">
        <Dropdown className="me-2">
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            Adults
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="/adults/bracelets">Bracelets</Dropdown.Item>
            <Dropdown.Item href="/adults/clothes">Necklaces</Dropdown.Item>
            <Dropdown.Item href="/adults/clothes">Earrings</Dropdown.Item>
            {/* <Dropdown.Divider />
            <Dropdown.Item href="/adults/se">Something else</Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="me-2">
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            Kids
          </Dropdown.Toggle>
          <Dropdown.Menu>
          <Dropdown.Item href="/kids/bracelets">Bracelets</Dropdown.Item>
            <Dropdown.Item href="/kids/clothes">Necklaces</Dropdown.Item>
            {/* <Dropdown.Divider />
            <Dropdown.Item href="/kids/se">Something else</Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>


      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <ProductWindow product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default HomeScreen;
