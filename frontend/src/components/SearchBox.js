import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useSearchParams  } from 'react-router-dom'



function SearchBox() {

    const [keyword, setKeyword] = useState('')

const submitHandler = (e) => {
    e.preventDefault()
}

  return (
    <div>
      <Form onSubmit={submitHandler} inline>
        <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} className='mr-sm-2 ml-sm-5'></Form.Control>
        <Button type='submit' className='btn p-2' variant='outline-success'>Submit</Button>
      </Form>
    </div>
  )
}

export default SearchBox
