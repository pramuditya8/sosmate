const express = require('express')
const app = express()
const port = 3000
const router = require("./routes")
const session = require("express-session");

app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true, // For security dari csrf attack
    },
  })
);

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})