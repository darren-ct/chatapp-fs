const express = require("express");
const router = express.Router();
const passport = require("passport");

const verifyJWT = require("../middleware/verifyJWT");
const { resetPassword , registerUser, resendCode , checkEmail , loginUser } = require("../controllers/auth");

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/register' }),
  function(req, res) {
     
  });

router.post("/api/v1/auth/register", registerUser);
router.post("/api/v1/auth/confirmemail/:code" , checkEmail)
router.post("/api/v1/auth/resendcode", resendCode)
router.post("/api/v1/auth/resetpassword" , verifyJWT , resetPassword)
router.post("/api/v1/auth/login", loginUser);




module.exports = router;

 