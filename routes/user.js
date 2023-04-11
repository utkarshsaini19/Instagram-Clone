const express = require('express')
const router = express.Router();
require('dotenv').config()
const Post = require('../models/post');
const User = require('../models/user');
const validation = require('../middleware/validation')

router.post('/user/:id', validation, async (req, res) => {
    let user = await User.findById(req.params.id).select('-password')
    if (user) {
        let post = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name")
        if (post) {
            return res.json({ user, post })
        }
        else {
            return res.status(404).json({ error: 'Post not found' })
        }
    }
    else {
        return res.status(404).json({ error: 'User not found' })
    }
})

router.put('/follow', validation, async (req, res) => {
    try {

        const user1 = await User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, {
            new: true
        }).select('-password')

        if (user1) {
            const user = await User.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, {
                new: true
            }).select('-password')
            if (user) {
                return res.json({ user, user1 })
            }
            else {
                return res.status(422).json({ error: "Error Updating following" })
            }

        }
        else {
            return res.status(422).json({ error: "Unable to find user" })
        }
    } catch (error) {
        return res.status(422).json({ error: error.message })
    }

})

router.put('/unfollow', validation, async (req, res) => {
    try {

        const user1 = await User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.user._id }
        }, {
            new: true
        })
        if (user1) {
            const user = await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.unfollowId }
            }, {
                new: true
            }).select('-password')
            if (user) {
                return res.json({ user, user1 })
            }
            else {
                return res.status(422).json({ error: "Error Updating following" })
            }

        }
        else {
            return res.status(422).json({ error: "Unable to find user" })
        }
    } catch (error) {
        return res.status(422).json({ error: error.message })
    }

})

router.put('/updatepic', validation, async (req, res) => {
    const result = await User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true }).select('-password');

    if (!result) {
        return res.status(422).json({ error: "pic cannot post" })
    }
    res.json(result)
})

router.post('/search-users', async (req, res) => {
    let userPattern = new RegExp("^" + req.body.query)
    let user = await User.find({ email: { $regex: userPattern } }).select("_id email")
    if(user)
    {
        res.json({ user })
    }
    else
    {
        console.log(err)
    }
})


module.exports = router;