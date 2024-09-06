import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_MAGIC_LINK_FAIL,
  USER_MAGIC_LINK_REQUEST,
  USER_MAGIC_LINK_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_LOGOUT,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_RESET,
  USER_VERIFICATION_EMAIL_REQUEST,
  USER_VERIFICATION_EMAIL_SUCCESS,
  USER_VERIFICATION_EMAIL_FAIL,
  USER_VERIFICATION_REQUEST,
  USER_VERIFICATION_SUCCESS,
  USER_VERIFICATION_FAIL,
} from "../constants/userConstants";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": " application/json",
      },
    };

 

    const { data } = await axios.post(
      "/api/users/login/",
      {
        username: email,
        password: password,
      },
      config
    );


    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const requestMagicLink = (email) => async (dispatch) => {
  try {
    dispatch({type: USER_MAGIC_LINK_REQUEST})

    new Promise(resolve => setTimeout(resolve, 3000));

    const config = {
      headers: {
        "Content-type": " application/json",
      },
    };

    // await new Promise(resolve => setTimeout(resolve, 3000));

    await axios.post(
      "/api/users/magic-link/get/",
      {email:email},
      config
    );

    dispatch({ type: USER_MAGIC_LINK_SUCCESS });

  } catch (error) {
    dispatch({
      type: USER_MAGIC_LINK_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const loginMagicLink = (userId, code) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": " application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/magic-link/verify/",
      {
        id: userId,
        code: code,
      },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": " application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/register/",
      {
        name: name,
        username: email,
        email: email,
        password: password,
      },
      config
    );

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${id}/`, config);
    
    console.warn('data : ', data)
    
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
     // Get the existing userInfo from localStorage
     const existingUserInfo = localStorage.getItem("userInfo")
     ? JSON.parse(localStorage.getItem("userInfo"))
     : {};

   // Merge the existing data with the new data from getUserDetails
   const updatedUserInfo = {
     ...existingUserInfo,
     ...data,  // This will override only the parts you receive from getUserDetails
   };

   // Save the merged object back to localStorage
   localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
   

  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/users/profile/update/`,
      user,
      config
    );

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // Get the existing userInfo from localStorage
    const existingUserInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : {};

    // Merge the existing data with the new data from getUserDetails
    const updatedUserInfo = {
      ...existingUserInfo,
      ...data,  // This will override only the parts you receive from getUserDetails
    };

    // Save the merged object back to localStorage
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/`, config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/users/delete/${id}/`, config);

    dispatch({ type: USER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/update/${user._id}/`, user, config);

    dispatch({ type: USER_UPDATE_SUCCESS });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const sendVerificationEmail = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_VERIFICATION_EMAIL_REQUEST,
    });
    
    const {
      userLogin: { userInfo },
    } = getState();
  
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
  
    await axios.post(`/api/users/verify-email/send/`, {}, config);

    dispatch({ type: USER_VERIFICATION_EMAIL_SUCCESS });
    
  } catch (error) {
    dispatch({
      type: USER_VERIFICATION_EMAIL_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
}

export const verifyUser = (verification_code) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_VERIFICATION_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();
  
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    console.log(config)
  
    await axios.get(`/api/users/verify-email/${verification_code}/`, config);

    dispatch({ type: USER_VERIFICATION_SUCCESS });
    dispatch(getUserDetails())

  } catch (error) {
    dispatch({
      type: USER_VERIFICATION_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
}