import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { listProducts, deleteProduct, createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

  const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  useEffect(() => {
    dispatch({type:PRODUCT_CREATE_RESET})

    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts(''));
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct]);

  const createProductHandler = () => {
    dispatch(createProduct())

  }

  const deleteProductHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product ?')) {
      dispatch(deleteProduct(id))
    }

  }

  return (
    <div>
        <Row className="align-items-center">
            <Col><h1>Products</h1></Col>
            <Col className="text-right">
                <Button className="my-3" onClick={createProductHandler}><i className="fas fa-plus"></i>Create product</Button>
            </Col>
        </Row>
        {loadingDelete && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover>
          <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Brand</th>
            <th></th>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>&euro;{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button className="btn-sm" variant="light">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                    <Button className="btn-sm" variant="danger" onClick={() => deleteProductHandler(product._id)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default ProductListScreen;
