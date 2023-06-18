const express = require('express');
const router = express.Router();
const UserRoutes = require('./user-routes');
const { InfoController } = require('../../controllers');

router.get('/info', InfoController.info);
router.use('/signup', UserRoutes)

module.exports = router;