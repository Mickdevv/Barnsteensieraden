import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginMagicLink, verifyUser } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";


function MagicLinkVerificationScreen() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const code = useParams().code;
    const userId = useParams().id;

    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    const [verificationAttempted, setVerificationAttempted] = useState(false);

    useEffect(() => {
        if (userInfo) {
            navigate("/profile");
        } else if (!verificationAttempted) {
            new Promise(resolve => setTimeout(resolve, 3000));
            dispatch(loginMagicLink(userId, code))
            setVerificationAttempted(true)
        }
    }, [userInfo, verificationAttempted, navigate, dispatch, userId, code])

  return (
    <div>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {userInfo && <Message variant="success">Redirecting...</Message>}
    </div>
  )
}

export default MagicLinkVerificationScreen
