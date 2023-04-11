import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { state,dispatch } = useContext(UserContext)
    const [profile, setProfile] = useState(null)
    const { userid } = useParams()
    const [showfollow, setShowfollow] = useState(state?!state.following.includes(userid):true)
    useEffect(() => {
        const fetchPost = async () => {
            const Data = await fetch(`/user/${userid}`, {
                method: 'post',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                }
            })
            const data = await Data.json()
            // console.log(data);
            setProfile(data)
        }
        fetchPost();
    }, [])

    const followUser = async () => {
        const Data = await fetch('/follow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                followId: userid
            })
        })

        const follow = await Data.json();
        // console.log(follow);
        dispatch({type:'UPDATE',payload:{following:follow.user.following,followers:follow.user.followers}})
        localStorage.setItem('user',JSON.stringify(follow.user))
        setProfile((prev)=>{
            return {
                ...prev,
                user:follow.user1
            }
        })
        setShowfollow(prev => !prev)
    }

    const unfollowUser = async () => {
        const Data = await fetch('/unfollow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        })

        const unfollow = await Data.json();
        // console.log(unfollow);
        dispatch({type:'UPDATE',payload:{following:unfollow.user.following,followers:unfollow.user.followers}})
        localStorage.setItem('user',JSON.stringify(unfollow.user))
        setProfile((prev)=>{
            return {
                ...prev,
                user:unfollow.user1
            }
        })
        setShowfollow(prev => !prev)
    }

    return (
        <>
            {
                !profile ?
                    <h5 style={{ textAlign: 'center' }}>Loading...</h5>
                    : <div style={{ maxWidth: "75%", margin: "0px auto" }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            margin: "18px 0px"
                        }}>
                            <div>
                                <img src={profile.user.pic} style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h4>{profile && profile.user.name}</h4>
                                <h4>{profile && profile.user.email}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                                    <h4>{profile?.post?.length} posts</h4>
                                    <h4>{profile?.user?.followers?.length} followers</h4>
                                    <h4>{profile?.user?.following?.length} following</h4>
                                </div>
                                {
                                    showfollow ?
                                <button onClick={()=>followUser()} className='btn waves-effect waves-light'>Follow</button>
                                :<button onClick={()=>unfollowUser()} className='btn waves-effect waves-light'>UnFollow</button>
                                }
                            </div>
                        </div>
                        <hr style={{ margin: '20px' }} />
                        <div className="gallery">
                            {
                                profile?.post?.map((item, index) => {
                                    return (
                                        <img key={index} className='item' src={item.photo} alt={item.title} style={{ objectFit: 'cover' }} />
                                    )
                                })
                            }


                        </div>
                    </div>
            }
        </>

    )
}

export default Profile