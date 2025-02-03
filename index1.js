const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors({origin:"*"}))
const MovieModel = require('./models/movie.model')
const initializeDatabase = require('./db/db.connect')


initializeDatabase()


//async error handler

const asyncErrorHandler = (asyfun) => {
  return (req,res,next) => {
    asyfun(req, res, next).catch(error => {
      next(error)
    })
  }
}


//post movies

app.post("/api/movies", asyncErrorHandler(async (req, res) => {
  
  
    const newMovies = new MovieModel(req.body)
    const savedMovies = await newMovies.save()

res.status(201).json(savedMovies)

}))

//

//error handling function
const errorHandling = (asyfun) => {
  return () => {
    asyfun(req,res,next)//get impilicity parameter like req,res,next
    //is a async function so we can catch all routs error here
    .catch((error)=>next(error))
}
}

//handle only one thing like get products and more...

app.get("/test", errorHandling(async (req, res) => {
  const products =await Model.find()
  res.status(200).json(products)
})) //get function in return that call asyncfunction


app.get("/api/movies",asyncErrorHandler(async(req,res) => {

  const movies = await MovieModel.find()
  return res.status(200).json(movies)

}))


app.get("/api/movies/:id",asyncErrorHandler(async(req,res) => {

  const movie = await MovieModel.findById(req.params.id)
  return res.status(200).json(movie)

}))


//all movies and find by title

// app.get("/api/movies/:id?",asyncErrorHandler(async(req,res) => {
  
//   const movieId = req.params.id

//   if (movieId)
//   {
//    const movie =await MovieModel.findById(movieId)
//     if (!movie)
//     {
//        return res.status(404).json("Movie Not Found")
//     }
//    return res.status(200).json(movie)
//   }

//   const movies = await MovieModel.find()
//   return res.status(200).json(movies)

// }))






//pagination

// app.get("/api/movies/:movieTitle?/:genre?/:year?", asyncErrorHandler(async (req, res) => {
  
// console.log(req.params.movieTitle)
// console.log(req.params.genre)
// console.log(req.params.year)

//   const queryParams = req.query
//   const skip = queryParams.skip || 0
//   const limit = queryParams.limit || 5

//     const allMovies = await MovieModel.find().skip(skip).limit(limit)
   
// res.status(200).json(allMovies)

// }))

// handling invalid routes

app.all('*', (req,res,next) => {
  const err = new Error("Route not found!")
  next(err)
})

//error handler middleware

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ error:error.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT,() => {
  console.log(`Server is Running on Port ${PORT}`)
})