const express = require("express")
const session = require("express-session")
const handlebar = require("express-handlebars")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const configRoutes = require("./routes")
const static = express.static(__dirname + "/public")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use("/public", static)
app.engine("handlebars", handlebar({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(cookieParser("sessiontest"))
app.use(session({
    name: 'AuthCookie', 
    secret: 'sessiontest', 
    resave: false, 
    saveUninitialized: false
}))

configRoutes(app)

app.listen(3000, function () {
    console.log(
        "Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it"
    )
})