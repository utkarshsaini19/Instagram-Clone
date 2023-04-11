import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const Navbar = () => {

    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const searchModal = useRef(null);

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])


    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
            })
    }

    const renderList = () => {
        if (state) {
            return [
                <li key='1'><i style={{ color: 'black', cursor: 'pointer' }} data-target="modal1" className="material-icons modal-trigger">search</i></li>,
                <li key='2'><Link to="/createpost">Upload</Link></li>,
                <li key='3'><Link to="/profile">Profile</Link></li>,
                <li key='4'><Link to="/myfollowingspost">My following Posts</Link></li>,
                <li key='5'>
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('jwt');
                            dispatch({ type: 'CLEAR' });
                            navigate('/signin');
                        }} className='btn waves-effect waves-light'>LogOut</button>
                </li>
            ]
        }
        else {
            return [
                <li key='6'><Link to="/signin">Login</Link></li>,
                <li key='7'><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? '/' : '/signin'} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}

                </ul>
            </div>
            <div id="modal1" ref={searchModal} className="modal">
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails.map(item => {
                            return <Link to={item?._id !== state?._id ? "/profilepage/" + item?._id : '/profile'} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li key={item?._id} className="collection-item">{item?.email}</li></Link>
                        })}

                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar