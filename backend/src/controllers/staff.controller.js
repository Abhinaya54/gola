const Note = require("../models/Note");
const Shift = require("../models/Shift");
const Client = require("../models/Client");

exports.getDashboard = async (req, res) => {
  try {
    const staffId = req.user.id;
    const activeShift = await Shift.findOne({ staff: staffId, status: "active" });
    const clients = await Client.find({ assignedStaff: staffId });
    res.json({ staffName: req.user.name, shift: activeShift, clientCount: clients.length, clients });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};

exports.createNote = async (req, res) => {
  try {
    const staffId = req.user.id;
    const { content } = req.body;
    const note = new Note({ text: content, staffId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Error saving note" });
  }
};
