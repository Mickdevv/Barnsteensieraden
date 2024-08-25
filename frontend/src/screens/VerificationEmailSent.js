import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { sendVerificationEmail } from '../actions/userActions'

import Message from '../components/Message'
import Loader from '../components/Loader';

function VerificationEmailSent() {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userSendEmailVerification = useSelector((state) => state.userSendEmailVerification);
  const { loading, success, error } = userSendEmailVerification;
      
  function sendVerificationEmailSubmit() {
      dispatch(sendVerificationEmail())
  }


  return (
    <div>
      {loading && <Loader />}
      {success && <Message variant='success'>Verification email sent to your inbox. Please be sure to check your spam folder.</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {userInfo.emailVerified ? (<Message variant='success'>Email already verified</Message>) :
      <>
        
    </>}
        <p>Didn't get it? <button className='btn-primary btn' onClick={sendVerificationEmailSubmit}>Click here</button> to receive a verification email</p>
    </div>
  )
}

export default VerificationEmailSent
