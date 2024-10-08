const express = require('express');
const router = express.Router();
const db = require("../db/queries");
const passport = require("../utils/passport");
const { body, validationResult } = require("express-validator");

const authMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  res.locals.currentUser = await req.user;
  next();
}

/* GET home page. */
router.get('/', authMiddleware, async function(req, res, next) {
  const messages = await db.getMessages();
  res.render('index', { title: 'Mini Messageboard', messages: messages });
});

router.get('/new', authMiddleware, function(req, res) {
  res.render('new', { title: 'New Message' });
}); 

router.post('/new', authMiddleware, async function(req, res) {
  const { user, message } = req.body;
  await db.insertMessage(user, message);
  res.redirect('/');
});

router.get('/message/:id', authMiddleware, async function(req, res) {
  const { id } = req.params;
  const message = await db.getMessage(id);
  res.render('message', { title: 'Message Details', message: message });
});

// Sign up and log in
router.get("/sign-up", (req, res) => {
  res.render("sign-up", { 
    title: "Sign Up Form",
    errors: undefined
  });
});

router.post("/sign-up", [
  body("firstName", "First name must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "Last name must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm-password").custom((value, { req }) => {
    return value === req.body.password;
  }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("sign-up", {
        title: "Sign Up Form",
        errors: errors.array()
      });
      return;
    } else {
      await db.createUser(req.body);
      res.redirect("/");
    }
  }
]);

router.get("/log-in", (req, res) => {
  res.render("log-in", { title: "Log In Form" });
});

router.post("/log-in", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.post("/log-out", (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/join-club", authMiddleware, (req, res) => {
  res.render("join-club", {
    title: "Join Club",
    errors: undefined
  });
});

router.post("/join-club", authMiddleware, [
  body("code", "Code must be at least 1 character")
    .trim()
    .isLength({ min:1 })
    .escape(),

  async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("join-club", {
        title: "Join Club",
        errors: errors.array()
      });
      return;
    } else {
      if (req.body.code === "abcd") {
        const user = await req.user;
        await db.updateUserMembership(user.id);
        res.redirect("/");
      } else {
        res.render("join-club", {
          title: "Join Club",
          errors: [{ msg: "Wrong code!" }]
        });
      }
    }
  }
]);

router.post("/delete-message", authMiddleware, async (req, res, next) => {
  await db.deleteMessage(req.body.messageid);
  res.redirect("/");
});

module.exports = router;
