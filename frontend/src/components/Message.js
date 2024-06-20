import React from "react";
import { Alert } from "react-bootstrap";

function Message({ variant, children }) {
  return <Alert variant={variant} children={children}></Alert>;
}

export default Message;
