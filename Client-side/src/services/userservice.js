import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const getAllUsers = () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const updateUserStatus = (ids, status) => {
  return axios.patch(API_URL, { ids, status }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const deleteUser = (ids) => {
  return axios.delete(API_URL, {
    data: { ids },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export default {
  getAllUsers,
  updateUserStatus,
  deleteUser
};
