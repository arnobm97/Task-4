import React from 'eact';
import Register from './Register';
import Login from './Login';
import UserManagement from './UserManagement';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return <Login />;
  }

  return (
    <div>
      <UserManagement />
    </div>
  );
}

export default App;