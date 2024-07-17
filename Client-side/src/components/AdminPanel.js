import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        history.push('/login');
      }
    };
    fetchUsers();
  }, [history]);

  const handleCheckboxChange = (id) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(userId => userId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.length === selectedUsers.length ? [] : users.map(user => user.id));
  };

  const handleUpdateStatus = async (status) => {
    try {
      await axios.patch('http://localhost:5000/api/users', {
        ids: selectedUsers,
        status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(users.map(user =>
        selectedUsers.includes(user.id) ? { ...user, status } : user
      ));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Updating status failed:', error);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      await axios.delete('http://localhost:5000/api/users', {
        data: { ids: selectedUsers },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Deleting users failed:', error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <div className="toolbar">
        <button className="btn btn-danger" onClick={() => handleUpdateStatus('blocked')}>Block</button>
        <button className="btn btn-secondary" onClick={() => handleUpdateStatus('active')}>Unblock</button>
        <button className="btn btn-danger" onClick={handleDeleteUsers}>Delete</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={users.length > 0 && selectedUsers.length === users.length}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.lastLogin}</td>
              <td>{user.registrationTime}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
