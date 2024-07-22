import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';

function SearchBox() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) {
      params.set('keyword', keyword);
    }

    if (keyword) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <Form onSubmit={submitHandler} className="d-inline-flex">
        <Form.Control
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="mr-sm-2 ml-sm-5"
        />
        <Button type="submit" className="btn p-2" variant="outline-success">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default SearchBox;
