
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/accounts/Login';
import Signup from './pages/accounts/Signup';
import Post from './pages/Post';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/authContext';
import PostAdmin from './pages/PostAdmin';
import PostAdmDetails from './pages/accounts/PostAdmDetails';

function App() {
  const { user} = useContext(AuthContext);
  const [loggedInUser, setLoggedInUser] = useState(user);
  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);
  return (
    <div className="App">
    <BrowserRouter>
  <Navbar />
    <Routes>
    {!loggedInUser ? (
            <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> 
            </>
          ) : (
            <>
             <Route path="/post" element={<Post />} />
             <Route path="/user" element={<UserList />} />
             <Route path='/adminPost' element={<PostAdmin />}/>
             <Route path='/detail/:id' element={<PostAdmDetails />}/>
            </>
          )}
    </Routes>
    <Toaster/>
    </BrowserRouter>
  </div>
  );
}

export default App;
