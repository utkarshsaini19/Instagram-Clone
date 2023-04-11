import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import M from 'materialize-css';

const Reset = () => {
  
  const [email, setEmail] = useState('')
  const navigate = useNavigate();

  const PostData = async () => {
    const Data = await fetch('/reset-password', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
         email
      })
    })

    const data = await Data.json();
    
    if (data.error) {
      M.toast({ html: data.error, classes: '#e53935 red darken-1' })
    }
    else {
      M.toast({ html: data.msg, classes: '#4db6ac teal lighten-2' })
      navigate('/signin')
    }

  }

  return (
    <div className='mycard'>
      <div className="card auth-card">
        <h5>Instagram</h5>
        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={PostData} className='btn waves-effect waves-light'>Reset Password</button>
      </div>
    </div>
  )
}

export default Reset