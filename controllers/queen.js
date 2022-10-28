const { validationResult } = require('express-validator')
const Queen = require('../models/queen')

const createQueen = async(req, res) =>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: 'Algo salió mal'})
  }
  try{
    const { name, coverImage } = req.body
    const newQueen = new Queen({
      name,
      coverImage
    })
    await newQueen.save()
    res.json(`Queen created successfully`)
  } 
  catch(error){
    return res.status(404).json({
      message: "Cannot create Queen"
    })
  }
}

const getQueen = async (req, res) => {
  try {
    const queens = await Queen.find({})
    res.status(200).json(queens)
  }
  catch (error) {
    return res.status(404).json({
      message: "Cannot found any Queen"
    })
  }
}

const editQueen = async (req, res) => {
  const { name, coverImage } = req.body
  try {
    await Queen.findByIdAndUpdate(req.params.queenId, {
      name,
      coverImage
    })
    res.json(`Queen ${name} edited.`)
  }
  catch (error) {
    return res.json({
      message: error
    })
  }
}

const deleteQueen = async (req, res) => {
  const { id } = req.body
  try {
    const queen = await Queen.findOneAndDelete({ _id: id })
    
    if (queen) {
      return res.status(200).json({
        mensaje: "Queen deleted succefully!",
      })
    }
    return res.status(404).json({
      mensaje: "Queen not found!",
    })
  } catch (error) {
    return res.status(404).json({
      message: "Cannot delete Queen",
      error
    })
  }
}

module.exports = { createQueen, getQueen, editQueen, deleteQueen }
