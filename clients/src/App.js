import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Regsiter from './pages/Regsiter';
import Home from './pages/Home';
import Start from './components/Start';
import Navbar from './components/Navbar';
function App() {
  return (
    
    <div className='bg-hero-pattern bg-no-repeat bg-cover overflow-x-hidden'>
      <Navbar />
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Regsiter />} />
          <Route exact path="/chats" element={<Home />} />
          <Route exact path="/" element={<Start />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
