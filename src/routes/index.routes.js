const express = require('express');
const router = express.Router();
const usersRouter = require('./user.routes');
const loginRouter = require('./login.routes');
const locationRouter = require('./location.routes');
const scheduleRouter = require('./schedule.routes');
const SOScheduleRouter = require('./SOSchedule.routes');
const servicesRouter = require('./services.routes');
const matchingRouter = require('./matching.routes');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send("WELCOME TO HOME NEEDS APP");
});

router.use('/users',usersRouter);
router.use('/login',loginRouter);
router.use('/location',locationRouter);
router.use('/schedule',scheduleRouter);
router.use('/SOSchedule',SOScheduleRouter);
router.use('/services',servicesRouter);
router.use('/quotes',matchingRouter);



module.exports = router;
