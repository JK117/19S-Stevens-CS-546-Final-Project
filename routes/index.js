const userRoute = require("./user")
const viewRoute =require("./view")
const profileRoute = require("./profile")
const detailRoute = require("./detail")

const constructorMethod = app => {
    app.use("/user", userRoute)
    app.use("/view", viewRoute)
    app.use("/profile", profileRoute)
    app.use("/detail", detailRoute)

    app.get("/", (req, res, next) => {
        if (!req.session.userName) {
            res.render("login", {title: "Car Rental"})
        } else {
            res.redirect(`/view/${req.session.userName}`)
        }
    })

    app.get("/signup", (req, res) => {
        res.render("signup", {title: "Car Rental"})
    })

    app.get("/logout", (req, res) => {
        console.log(`GET Request: ${req.session.userName} successfully logged out.`)
        req.session.destroy(function(err) {
            res.redirect('/')
        })
    })

    app.use("*", (req, res) => {
        res.redirect("/")
    })
}

module.exports = constructorMethod
