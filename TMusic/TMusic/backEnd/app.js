// 在这里对全局的,公共的中间件函数进行添加
// 因为在Node环境下运行，使用commonJS

const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const csrf = require("xsrf");
const registerRouter = require("./router");


// 分为开发和生产时Port
const port = 9002;

const app = express();

// const csrfProtection = csrf({
//   cookie: true,
//   ignoreMethods: ["HEAD", "OPTIONS"],
//   checkPathReg: /^\/api/,
// });
// app.use(cookieParser());
// app.use(csrfProtection);

// app.get("/", function (req, res, next) {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   return next();
// });

registerRouter(app);

// app.use(compression());

// app.use(express.static("./dist"));

// app.use(function (err, req, res, next) {
//   if (err.code !== "EBADCSRFTOKEN") {
//     return next();
//   }

//   // handle CSRF token errors here
//     res.status(403);
//     res.send("hello!")
// });

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Listening at https://localhost:" + port + "\n");
});
