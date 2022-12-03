const express = require('express')

const app = express()

// app.use((req,res,next)=>{
//   console.log('Something xD')
//   next()
// })

// app.use((req,res,next)=>{
//   console.log('Another Thing')
//   return res.send("<h1>Hello World From The Home Page</h1>")
// })

app.use('/users',(req,res,next)=>{
  console.log('Users Page Middleware')
  res.send('<h1>Hello From UsersPage</h1>')
})

app.use('/',(req,res,next)=>{
  console.log('Home Page Middleware')
  res.send('<h1>Hello From HomePage</h1>')
})


app.listen(3000)