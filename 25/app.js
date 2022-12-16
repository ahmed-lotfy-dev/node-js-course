import * as dotenv from 'dotenv'
dotenv.config()
import cors from "cors"

import bodyParser from "body-parser"

import express from "express"

const app = express()

import feedRoutes from "./routes/feed.js"

// app.use(bodyParser.urlencoded()) // x-www-form-urlencoded <form></form>

app.use(bodyParser.json())
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Method', 'GET,POST,PATCH,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  next()
})

app.use('/feed', feedRoutes)

app.listen(process.env.PORT, () => {
  console.log(`server started on http://localhost:${process.env.PORT}`)
})