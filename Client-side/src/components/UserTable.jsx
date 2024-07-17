// src/components/UserTable.js

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const selectAllRef = useRef(null); // Create a ref for the "select all" checkbox

  useEffect(() => {
    axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;
      selectAllRef.current.checked = selectedUsers.length === users.length;
    }
  }, [selectedUsers, users]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]);
  };

  const handleAction = (action) => {
    selectedUsers.forEach(id => {
      axios.patch(`http://localhost:5000/api/users/${action}/${id}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(() => {
          setUsers(users.filter(user => !selectedUsers.includes(user._id)));
          setSelectedUsers([]);
        })
        .catch(err => console.log(err));
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-2">
        <button onClick={() => handleAction('block')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Block</button>
        <button onClick={() => handleAction('unblock')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Unblock</button>
        <button onClick={() => handleAction('delete')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Delete</button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                ref={selectAllRef} // Assign the ref to the checkbox
                className="form-checkbox"
              />
            </th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Last Login</th>
            <th className="px-4 py-2 text-left">Registration Date</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className={`hover:bg-gray-100 ${user.isBlocked ? 'bg-red-50' : ''}`}>
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleSelectUser(user._id)}
                  className="form-checkbox"
                />
              </td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
              <td className="px-4 py-2">{new Date(user.registrationDate).toLocaleString()}</td>
              <td className="px-4 py-2">{user.isBlocked ? 'Blocked' : 'Active'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
