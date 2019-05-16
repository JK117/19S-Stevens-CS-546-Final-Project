const userRoute = require("./user")

const constructorMethod = app => {
    app.use("/user", userRoute)

    app.get("/", (req, res) => {
        res.render("login", {title: "Car Rental"})
    })

    app.use("*", (req, res) => {
        res.redirect("/")
    })
}

module.exports = constructorMethod;