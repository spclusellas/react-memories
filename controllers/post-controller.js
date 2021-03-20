import mongoose from 'mongoose'
import PostMessege from '../models/PostMessege.js'

export const getPosts = async (req, res, next) => {
    try {
        const postMesseges = await PostMessege.find()
        res.status(200).json(postMesseges)
    } catch (error) {
        res.status(404).json({messege: error.messege})
    }
}

export const createPost = async (req, res, next) => {
    console.log(req.body)
    const newPost = new PostMessege(req.body)
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({messege: error.messege})
    }
}

export const updatePost = async (req, res, next) => {
    const { id: _id } = req.params
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(404).send("No post with this id")
    }

    const updatedPost = await PostMessege.findByIdAndUpdate(_id, {...post, _id}, { new: true })

    res.json(updatedPost)
}

export const deletePost = async (req, res, next) => {
    const { id: _id } = req.params

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(404).send("No post with this id")
    }

    await PostMessege.findByIdAndRemove(_id)

    res.json({ messege: "Post deleted successfully!" })
}

export const likePost = async (req, res, next) => {
    const { id: _id } = req.params

    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(404).send("No post with this id")
    }

    const post = await PostMessege.findById(_id)
    const updatedPost = await PostMessege.findByIdAndUpdate(_id, { likeCount: post.likeCount + 1 }, { new: true })

    res.json(updatedPost)
}