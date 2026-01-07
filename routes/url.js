const express = require("express");

// debug import
const controllers = require("../controllers/url");
console.log("controllers import:", controllers);
const { handleGenerateNewShortURL, handleRedirect } = controllers;
console.log("handleGenerateNewShortURL type:", typeof handleGenerateNewShortURL);
console.log("handleRedirect type:", typeof handleRedirect);

const router = express.Router();

router.post("/", handleGenerateNewShortURL); // <-- error occurs here if handler is not a function
router.get("/:shortId", handleRedirect);

module.exports = router;