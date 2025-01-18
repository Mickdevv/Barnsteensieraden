import React, { useState, useEffect } from "react";
import Product from "../components/Product";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { listProducts, setProductFilter, resetProductFilter } from "../actions/productActions";
import { Row, Col, Dropdown } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductWindow from "../components/ProductWindow";

function HomeScreen() {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;

  const productFilter = useSelector((state) => state.productFilter);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryOptions, setCategoryOptions] = useState([])


  let keyword = location.search;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (productFilter.category !== "") {
      products.filter((p) => p.category === productFilter.category)
    }
  }, [dispatch, productFilter, products])

  // Update category options based on the fetched products
  useEffect(() => {
    if (products.length > 0) {
      setCategoryOptions([...new Set(products.map((p) => p.category))]); // Ensure unique categories
    }
    console.warn(categoryOptions)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);


  const setFilterState = (category) => {
    console.log(category, categoryOptions)
    dispatch(setProductFilter(category));
  };
  const resetFilterState = () => {
    dispatch(resetProductFilter());
  };

  return (
    <div>
      <div className="d-flex">
        <Dropdown className="me-2">
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            {productFilter.category !== "" ? productFilter.category : "Category"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
          <Dropdown.Item onClick={() => resetFilterState()}>Reset</Dropdown.Item>
          {categoryOptions.map((c) => (
              <Dropdown.Item onClick={() => setFilterState(c)} key={c}>{c}</Dropdown.Item>
            ))}
            {/* <Dropdown.Divider />
            <Dropdown.Item href="/adults/se">Something else</Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>


      {loading || !products ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
<Row>
  {productFilter.category !== "" ? (
    products
      .filter((p) => p.category === productFilter.category)
      .map((product) => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
          <ProductWindow product={product} />
        </Col>
      ))
  ) : (
    products.map((product) => (
      <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
        <ProductWindow product={product} />
      </Col>
    ))
  )}
</Row>
      )}
    </div>
  );
}

export default HomeScreen;
