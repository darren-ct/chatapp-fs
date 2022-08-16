const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");
const { resetPassword , registerUser, resendCode , loginUser, checkCode } = require("../controllers/auth");

router.post("/api/v1/auth/register", registerUser);
router.post("/api/v1/auth/confirmemail/:code" , checkCode)
router.post("/api/v1/auth/resendcode", resendCode)
router.post("/api/v1/auth/resetpassword" , verifyJWT , resetPassword)
router.post("/api/v1/auth/login", loginUser);




module.exports = router;

 