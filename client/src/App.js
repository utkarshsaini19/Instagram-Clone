import { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, useNavigate,useLocation } from 'react-router-dom'
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPost from './components/screens/SubscribedUserPost';
import { initialState, reducer } from './reducers/userReducer';
import Reset from './components/screens/Reset';
import Newpass from './components/screens/NewPass';

export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate();
  const location  = useLocation();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    console.log("Inside App useffect");
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      if (!location?.pathname.startsWith('/reset')) {
        navigate('/signin');
      }

    }
    else {
      dispatch({ type: 'USER', payload: user })

    }
  }, [])
  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/myfollowingspost' element={<SubscribedUserPost />} />
      <Route exact path='/signin' element={<Signin />} />
      <Route exact path='/reset' element={<Reset />} />
      <Route exact path='/reset/:token' element={<Newpass /> } />
      <Route exact path='/profilepage/:userid' element={<UserProfile />} />
      <Route exact path='/profile' element={<Profile />} />
      <Route exact path='/signup' element={<Signup />} />
      <Route exact path='/createpost' element={<CreatePost />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
