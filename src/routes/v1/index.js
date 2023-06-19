const express = require('express');
const router = express.Router();
const UserRoutes = require('./user-routes');
const { InfoController } = require('../../controllers');

router.get('/info', InfoController.info);
router.use('/user', UserRoutes)

module.exports = router;