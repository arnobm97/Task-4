import React, { useState, useEffect } from 'eact';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    axios.get('/users')
     .then(response => {
        setUsers(response.data);
      })
     .catch(error => {
        console.error(error);
      });
  }, []);

  const handleBlock = async (userId) => {
    await axios.put(`/users/${userId}/block`);
    setUsers(users.map(user => user._id === userId? {...user, status: 'blocked' } : user));
  };

  const handleUnblock = async (userId) => {
    await axios.put(`/users/${userId}/unblock`);
    setUsers(users.map(user => user._id === userId? {...user, status: 'active' } : user));
  };

  const handleDelete = async (userId) => {
    await axios.delete(`/users/${userId}`);
    setUsers(users.filter(user => user._id!== userId));
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map(user => user._id));
  };

  const handleSelect = (userId) => {
    setSelectedUsers(selectedUsers.includes(userId)? selectedUsers.filter(id => id!== userId) : [...selectedUsers, userId]);
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length}
                onChange={handleSelectAll}
                className="form-checkbox"
              />
            </th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Last Login</th>
            <th className="px-4 py-2">Registration Time</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleSelect(user._id)}
                  className="form-checkbox"
                />
              </td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.lastLogin}</td>
              <td className="px-4 py-2">{user.registrationTime}</td>
              <td className="px-4 py-2">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleBlock(selectedUsers)}
        >
          Block
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={() => handleUnblock(selectedUsers)}
        >
          Unblock
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={() => handleDelete(selectedUsers)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserManagement;