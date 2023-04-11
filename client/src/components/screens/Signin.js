import React, { useState, useContext } from 'react'
import { useNavigate,Link } from 'react-router-dom';

import M from 'materialize-css';
import { UserContext } from '../../App';

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate();

  const PostData = async () => {
    const Data = await fetch('/signin', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, password
      })
    })

    const data = await Data.json();

    if (data.error) {
      M.toast({ html: data.error, classes: '#e53935 red darken-1' })
    }
    else {
      localStorage.setItem('jwt', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch({ type: "USER", payload: data.user })
      M.toast({ html: "Yay,Sign In Successful!", classes: '#4db6ac teal lighten-2' })
      navigate('/')
    }

  }

  return (
    <div className='mycard'>
      <div className="card auth-card">
        <h5>Instagram</h5>
        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={PostData} className='btn waves-effect waves-light'>Sign In</button>
        <h4>
          <Link to="/reset">Forgot password ?</Link>
        </h4>
      </div>
    </div>
  )
}

export default Signin