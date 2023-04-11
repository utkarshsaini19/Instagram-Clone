const express = require('express')
const router = express.Router();
require('dotenv').config()
const Post = require('../models/post');
const validation = require('../middleware/validation');

router.get('/allposts',validation ,async (req,res)=>{
    const posts = await Post.find().populate('postedBy',"_id name").populate('comments.postedBy',"_id name").sort('-createdAt');
    
    if(posts)
    {
        return res.status(200).json({posts})
    }

    return res.status(422).json({error:"Error while fetching posts"})

})

router.get('/getsubpost',validation ,async (req,res)=>{
    const posts = await Post.find({postedBy:{$in:req.user.following}}).populate('postedBy',"_id name").populate('comments.postedBy',"_id name").sort('-createdAt');
    
    if(posts)
    {
        return res.status(200).json({posts})
    }

    return res.status(422).json({error:"Error while fetching posts"})

})


router.post('/createpost', validation, async(req,res)=>{
    const {title,body,url} = req.body;
    if(!title || !body || !url)
    {
        return res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined;
    const post = await Post.create({
        title,
        body,
        photo:url,
        postedBy: req.user
    })

    if(post)
    {
        return res.status(200).json({post:post})
    }

    return res.status(422).json({error:"Cannot save!"})
})

router.get('/mypost',validation,async(req,res)=>{
    const posts= await Post.find({postedBy:req.user._id}).populate('postedBy',"_id name")

    if(posts)
    {
        return res.json({posts})
    }
    return res.status(422).json({error:"Error occured while fetching posts!"})
})

router.put('/like',validation,async (req,res)=>{
    const result = await Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    });
    if(result){
        return res.json(result);
    }
    else{
        return res.status(422).json(result);
    }
})

router.put('/unlike',validation,async (req,res)=>{
    const result = await Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    });
    if(result){
        return res.json(result);
    }
    else{
        return res.status(422).json(result);
    }
})

router.put('/comment',validation,async (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy: req.user._id
    }
    const result = await Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name").populate('postedBy',"_id name")
    if(result){
        return res.json(result);
    }
    else{
        return res.status(422).json(result);
    }
})

router.delete('/deletepost/:postId',validation,async (req,res)=>{
    
    let post = await Post.findById(req.params.postId).populate('postedBy','_id');

    if(!post)
    {
        return res.status(422).json({eroor:'Unable to find record!'});
    }
    else{
        if(post.postedBy._id.toString() === req.user._id.toString())
        {
             post = await Post.findByIdAndDelete(req.params.postId);
             
            if(post)
            {
                res.json({post});
            }
            else
            {
                res.json({error:"Error deleting record!"});
            }
        }
    }
})

module.exports = router;