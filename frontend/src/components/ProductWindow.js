import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function ProductWindow({ product }) {

  return (
    <Card className='my-2 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} />
      </Link>

    </Card>
  )
  

}

export default ProductWindow
