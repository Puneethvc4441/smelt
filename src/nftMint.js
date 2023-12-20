const router = require("express").Router(); 
const {safeMint,nftBalance} = require("./helpers/mintingHelpers.js"); 
const { tokenBalance } = require("./mintingHelpers.js");
 
router.route("/mint")
    .post(safeMint);

router.route("/data")
.post(tokenBalance)

module.exports = router;