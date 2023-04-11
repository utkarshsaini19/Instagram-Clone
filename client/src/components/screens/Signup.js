import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate();
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)


  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])


  const uploadPic = async () => {
    // console.log("Inside uploadPic");
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'instagram-clone')
    data.append('cloud_name', 'dm6m7j48j')
    const Data = await fetch('https://api.cloudinary.com/v1_1/dm6m7j48j/image/upload', {
      method: 'post',
      body: data
    })
    const res = await Data.json();
    // console.log(res);
    setUrl(res.secure_url);
  }

  const PostData = async () => {
    if (image) {
      await uploadPic()
    } else {
      uploadFields()
    }

  }

  

  const uploadFields = async () => {
    const Data = await fetch('/signup', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, email, password, pic: url,
      })
    })

    const data = await Data.json();
    if (data.error) {
      M.toast({ html: data.error, classes: '#e53935 red darken-1' })
    }
    else {
      M.toast({ html: data.message, classes: '#4db6ac teal lighten-2' })
      navigate('/signin')
    }
  }



  return (
    <div className='mycard'>
      <div className="card auth-card">
        <h5>Instagram</h5>
        <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Upload pic</span>
            <input type="file" onChange={(e) => {
              // console.log(e.target.files);
              setImage(e.target.files[0])
            }} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button onClick={PostData} className='btn waves-effect waves-light'>Sign Up</button>
        <h5><Link to='/signin'>Already have an account?</Link></h5>
      </div>
    </div>
  )
}

export default Signup