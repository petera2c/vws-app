const passport = require("passport");
const mongoose = require("mongoose");
const User = require("../models/User");
const problemFunctions = require("./problemFunctions");

module.exports = app => {
  // Middleware
  const middleware = (req, res, next) => {
    if (!req.user) return randomLogin(req, res, next);
    else next();
  };

  // Get current user
  app.get("/api/user", middleware, (req, res, next) => {
    res.send({ success: true, user: req.user, port: process.env.PORT });
  });
  app.post("/api/new-problem", middleware, (req, res) =>
    problemFunctions.saveProblem(req, res)
  );

  app.get("/api/problems", (req, res) =>
    problemFunctions.getProblems(req, res)
  );

  app.post("/api/new-comment", (req, res) =>
    problemFunctions.newComment(req, res)
  );
  // Login user
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local-login", (err, user, message) => {
      let success = true;

      if (err) success = false;
      if (!user) success = false;

      if (success) {
        req.session.destroy(() => {
          res.clearCookie("connect.sid");
          req.logIn(user, err => {
            if (err) {
              success = false;
              message =
                "Could not log you in! :( Please refresh the page and try again :)";
            }
            res.send({ success, user, message });
          });
        });
      } else {
        res.send({ success, message });
      }
    })(req, res, next);
  });
  // Register user
  app.post("/api/register", (req, res, next) => {
    passport.authenticate("local-signup", (notUsed, user, message) => {
      let success = true;
      if (!user) success = false;
      if (success) {
        const login = () => {
          req.logIn(user, err => {
            if (err) {
              success = false;
              message =
                "Could not log you in! :( Please refresh the page and try again :)";
            }
            res.send({ success, user, message });
          });
        };
        login();
      } else {
        res.send({ success, message });
      }
    })(req, res, next);
  });
};

randomLogin = (req, res, next) => {
  passport.authenticate("local-login", (err, user, message) => {
    const password = Math.floor(Math.random() * 1000000000);

    const newUser = new User({
      password,
      displayName: password,
      language: "english",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateCreated: new Date()
    });
    newUser.save().then(savedUser => {
      req.logIn(savedUser, err => {
        if (err)
          res.send({
            success: false,
            message:
              "Could not log you in! :( Please refresh the page and try again :)"
          });
        else res.send({ success: true, user: savedUser });
      });
    });
  })(req, res, next);
};