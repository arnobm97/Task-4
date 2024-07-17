import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

const getUsers = () => {
  return axios.get(API_URL + 'users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const updateUserStatus = (ids, status) => {
  return axios.patch(API_URL + 'users', {
    ids,
    status
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const deleteUsers = (ids) => {
  return axios.delete(API_URL + 'users', {
    data: { ids },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export default {
  getUsers,
  updateUserStatus,
  deleteUsers
};
