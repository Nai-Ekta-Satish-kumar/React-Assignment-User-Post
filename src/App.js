import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/accounts/Login';
import Signup from './pages/accounts/Signup';
import Post from './pages/Post';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
  <Navbar />
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/post" element={<Post />} />
    <Route path="/user" element={<UserList />} />
    
    </Routes>
    <Toaster/>
   
    </BrowserRouter>
  </div>
  );
}

export default App;
