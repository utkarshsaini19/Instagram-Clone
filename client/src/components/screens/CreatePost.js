import React, { useEffect, useState } from 'react'
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {

            
            const Data1 = await fetch('/createpost', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    title, body, url
                })
            })

            const data1 = await Data1.json();

            if (data1.error) {
                M.toast({ html: data1.error, classes: '#e53935 red darken-1' })
            }
            else {
                M.toast({ html: "Created Post Successfully!", classes: '#4db6ac teal lighten-2' })
                navigate('/')
            }

        }
        if(url)
        {
            fetchData();
        }
    }, [url])


    const PostDetails = async () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'instagram-clone')
        data.append('cloud_name', 'dm6m7j48j')
        const Data = await fetch('https://api.cloudinary.com/v1_1/dm6m7j48j/image/upload', {
            method: 'post',
            body: data
        })
        const res = await Data.json();
        setUrl(res.secure_url);
        




    }
    return (
        <div className="cards input-filed"
            style={{
                margin: '10px auto',
                maxWidth: '50%',
                padding: '20px',
                textAlign: 'center',
                border: '2px solid grey',
                borderRadius: '10px'

            }}
        >
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter something...' />
            <input value={body} onChange={(e) => setBody(e.target.value)} type="text" placeholder='Enter Details...' />

            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button onClick={PostDetails} className='btn waves-effect waves-light'>Submit post</button>

        </div>
    )
}

export default CreatePost