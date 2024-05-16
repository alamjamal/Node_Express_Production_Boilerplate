const express = require("express");
const router = express.Router();
const control = require("./user.public.controller");
const catchAsync = require("../../middleware/catchAsync");
const Validator = require("../../middleware/validator");
const { validateUser, schemaTest , idAndEmailValidation , tokenOnlyValidation , logInValidation,emailOnlyValidation , passwordOnlyValidation} = require('./user.validate')
const {UserAuth} = require('../../middleware/userAuth')
//route
router.post("/login",Validator(logInValidation), catchAsync(control.login));
router.post("/register", Validator(validateUser), catchAsync(control.register));
router.post("/activate", Validator(tokenOnlyValidation),catchAsync(control.activateAccount));
router.post("/resendlink", Validator(idAndEmailValidation),catchAsync(control.resendLink));

router.post("/forgotpassword",Validator(emailOnlyValidation), catchAsync(control.forgotPassword));
router.get("/forgotpasswordlink/:token",Validator(tokenOnlyValidation,true), catchAsync(control.forgotPasswordLink));
router.post("/changepassword/:token",Validator(tokenOnlyValidation,true), Validator(passwordOnlyValidation) , catchAsync(control.changePassword));
router.post("/resendlinkpassword", Validator(idAndEmailValidation),catchAsync(control.resendLinkPassword));



router.get("/getaccesstoken", catchAsync(control.getAccessToken));
router.get("/logout",UserAuth, catchAsync(control.logout));



const multer = require('multer');


const { compressImage } = require("../../middleware/compressImage");
const { upload } = require('../../middleware/upload')
const { multerError, checkFile } = require('../../middleware/multerError')

router.post("/uploadImage",
    // upload.none(),
    upload.single("image"),
    Validator(schemaTest),
    multerError,
    checkFile,
    catchAsync(compressImage),
    catchAsync(control.ImageUpload)
);


module.exports = router;
