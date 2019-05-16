const userRoute = require("./user")

const constructorMethod = app => {
    app.use("/signup", userRoute)
    // app.use("/details", detailsRoutes)

    app.get("/", (req, res) => {
        res.render("signup", {title: "Car Rental"})
    })

    app.use("*", (req, res) => {
        res.sendStatus(404)
    })
}

module.exports = constructorMethod;