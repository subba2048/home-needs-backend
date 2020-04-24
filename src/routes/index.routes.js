const express = require('express');
const router = express.Router();
const usersRouter = require('./user.routes');
const loginRouter = require('./login.routes');
const locationRouter = require('./location.routes');
const scheduleRouter = require('./schedule.routes');
const SOScheduleRouter = require('./SOSchedule.routes');
const servicesRouter = require('./services.routes');
const matchingRouter = require('./matching.routes');
const srRouter = require('./serviceRequest.routes');
const ratingRouter = require('./rating.routes');
const SRLocationRouter = require('./SRLocation.routes');
const SOLocationRouter = require('./SOLocation.routes');


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
router.use('/servicerequest',srRouter);
router.use('/ratings', ratingRouter);
router.use('/srlocation', SRLocationRouter);
router.use('/solocation', SOLocationRouter);


module.exports = router;
