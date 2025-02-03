const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors({origin:"*"}))
const MovieModel = require('./models/movie.model')
const initializeDatabase = require('./db/db.connect')

initializeDatabase()


//1. Find Movies by Exact Year
//2. Find Movies Not in a Specific Genre
//3. Find Movies by relase Year more then 2015

app.get("/api/movies/excercise1", async (req, res) => {
  const {search, year, filterOutGenre, minYear,skip,limit } = req.query
  
 const skipNum = skip || 0
 const limitNum = limit || 5
  
  const filter = {}
    const searchObj ={$or:[
      { title: { $regex: search, $options: "i" } },
      { genre: { $regex: search, $options: "i" } },
      { year: { $regex: search, $options: "i" } }
   ]} 

  if (year)
  {
filter.year = {$eq:year}
  }
  if (filterOutGenre)
  {
    filter.genre ={$ne:filterOutGenre}
  }
  if (minYear)
  {
    filter.year = {$gte:minYear}
  }

  const finalValue = search ? searchObj : filter
  
  try {

    const totalMovies = await MovieModel.find(finalValue)

    console.log(totalMovies.length)

    const movies =await MovieModel.find(finalValue).skip(skipNum).limit(limitNum)

    res.status(200).json({movies,skip:skipNum*1,limit:limitNum*1,total:totalMovies.length*1})
  }
  catch {
    res.status(500).json({error:"failed to get movies"})
  }
})




//all movies

app.get("/api/movies", async (req, res) => {
  
  const { search, ...rest } = req.query
  
  let filter = search ?
    { $or: [{ title: { $regex: search, $options: 'i' } }, { genre: { $regex: search, $options: 'i' } }, { year: { $regex: search, $options: 'i' } }] }
    : rest

  try {
    if (Object.keys(filter).length>0)
    {
      const moviesbyTitle = await MovieModel.find(filter)
      if (!moviesbyTitle||moviesbyTitle.length===0)
    {
     return res.status(404).json({error:"movie not found"})
    }
    return res.status(200).json(moviesbyTitle)
    }
    const allMovies = await MovieModel.find()
    res.status(200).json(allMovies) 
  }
  catch {
    res.status(500).json({error:"failed to get movies"})
  }
})

//movie by id

app.get("/api/movies/:id", async(req,res) => {
  try {
    const movie =await MovieModel.findById(req.params.id)
    if (!movie)
    {
     return res.status(400).json({error:"movie not found"})
    }
    res.status(200).json(movie)
  }
  catch {
    res.status(500).json({error:"failed to get movie"})
  }
})


//add movie

app.post("/api/movies", async(req,res) => {
  try {
    const newMovie = new MovieModel(req.body)
   const savedMovie = await newMovie.save()
   res.status(201).json(savedMovie)
  }
  catch {
    res.status(500).json({error:"failed to add movie"})
  }
})

//delete movie

app.delete("/api/movies/:id", async(req,res) => {
  try {
    const deletedMovie =await MovieModel.findByIdAndDelete(req.params.id)
   res.status(200).json(deletedMovie)
  }
  catch {
    res.status(500).json({error:"failed to delete movie"})
  }
})


const PORT = process.env.PORT || 5000
app.listen(PORT,() => {
  console.log(`Server is Running on Port ${PORT}`)
})