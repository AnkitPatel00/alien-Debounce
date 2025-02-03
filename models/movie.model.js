const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
title:{type:String,required:[true,"Title is required"]},
genre:[{type:String,required:true}],
year:{type:String,required:true}
}, { timestamps: true })

const MovieModel = mongoose.model("paginationMovie", movieSchema)

module.exports = MovieModel