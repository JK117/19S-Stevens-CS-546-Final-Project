const userRoute = require("./user")

const constructorMethod = app => {
    app.use("/user", userRoute)

    // app.get("/", (req, res) => {
    //     res.render("login", {title: "Car Rental"})
    // })

    app.get("/", (req, res, next) => {
        if (!req.session.userName) {
            res.render("login", {title: "Car Rental"})
        } else {
            res.render("temp", {session: req.session})
        }
    })

    app.get("/signup", (req, res) => {
        res.render("signup", {title: "Car Rental"})
    })

    app.get("/logout", (req, res) => {
        req.session.destroy(function(err) {
            // if(err){
            //     res.json({ret_code: 2, ret_msg: '退出登录失败'});
            //     return;
            // }
            
            // // req.session.loginUser = null;
            // res.clearCookie(identityKey)
            res.redirect('/')
        });
    })

    app.use("*", (req, res) => {
        res.redirect("/")
    })
}

module.exports = constructorMethod;