const express = require('express');
const router = express.Router();
const usersRouter = require('./user.routes');
const loginRouter = require('./login.routes');
const locationRouter = require('./location.routes');
const scheduleRouter = require('./schedule.routes');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send("WELCOME TO HOME NEEDS APP");
});

router.use('/users',usersRouter);
router.use('/login',usersRouter);
router.use('/location',locationRouter);
router.use('/schedule',usersRouter);


module.exports = router;
