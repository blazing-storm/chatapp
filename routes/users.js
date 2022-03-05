const passport = require('passport');
const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/sign-out', usersController.destroySession);

router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);

router.post('/create', usersController.create);

router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);

module.exports = router;