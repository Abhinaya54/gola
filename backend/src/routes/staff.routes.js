const router = require("express").Router();
const { getDashboard, createNote } = require("../controllers/staff.controller");
const auth = require("../middleware/auth.middleware");

router.get("/dashboard", auth, getDashboard);
router.post("/notes", auth(["staff"]), createNote);

module.exports = router;
