import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

const Home = () => {

  const { state } = useContext(UserContext)
  const [data, setData] = useState([])

  useEffect(() => {
    console.log("Inside SubscribedUser useffect");
    const fetchData = async () => {
      const Data = await fetch('/getsubpost', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      const data = await Data.json();
      setData(data.posts)

    }
    fetchData();

  }, [])

  const likePost = async (id) => {
    const Data = await fetch('/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        postId: id
      })
    })
    const data1 = await Data.json();
    // console.log(data1);
    const newData = data.map((item) => {
      if (item._id === data1._id) {
        return data1
      }
      else {
        return item;
      }
    })
    setData(newData)

  }
  const unlikePost = async (id) => {
    const Data = await fetch('/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        postId: id
      })
    })
    const data2 = await Data.json();
    const newData = data.map((item) => {
      if (item._id === data2._id) {
        return data2
      }
      else {
        return item;
      }
    })
    setData(newData)

  }

  const makeComment = async (text, postId) => {
    const Data = await fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        text, postId
      })
    })

    const comment = await Data.json();
    console.log(comment);
    const newData = data.map((item) => {
      if (item._id === comment._id) {
        return comment
      }
      else {
        return item;
      }
    })
    setData(newData)
  }

  const deletePost = async (postid) => {
    const Data = await fetch(`/deletepost/${postid}`, {
      method: 'delete',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    const postdel = await Data.json();
    // console.log(postdel);
    const newData = data.filter((item,index)=>{
      return item._id !== postdel.post._id;
    })
    setData(newData);
  }

  return (
    <div className="home">
      {
        data.map((item, index) => {
          return (
            <div key={index} className="card home-card">
              <Link to={item.postedBy._id !== state._id ?`/profilepage/${item.postedBy._id}`:'/profile'}> <h4 style={{display:'inline'}}>{item.postedBy.name}</h4></Link>
              {item.postedBy._id == state._id &&
              
              <i onClick={()=>deletePost(item._id)} style={{ cursor: 'pointer',float:'right',fontSize: '34px' }} className="material-icons">delete</i>
              }
              <div className='card-image'>
                <img src={item.photo} alt="Image" />
              </div>
              <div className="card-content">
                <i className="material-icons">favorite_border</i>
                {
                  item.likes.includes(state._id) ?
                    <i style={{ cursor: 'pointer' }} onClick={() => { unlikePost(item._id) }} className="material-icons">thumb_down</i>
                    : <i style={{ cursor: 'pointer' }} onClick={() => { likePost(item._id) }} className="material-icons">thumb_up</i>
                }

                <h4>{item.likes.length} likes</h4>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
                {
                  item.comments.map(record => {
                    return (

                      <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}</h6>

                    )
                  })
                }
                <form onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id)

                }}>

                  <input type="text" placeholder='Write a comment...' />
                </form>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home