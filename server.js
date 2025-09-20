const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Student = require("./models/Student");

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/student_results", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// GET all students
app.get("/students", async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
});

// POST add student
app.post("/students", async (req, res) => {
  try {
    const { name, roll, marks } = req.body;
    const { math, physics, chemistry } = marks;

    if ([math, physics, chemistry].some(m => m < 0 || m > 100)) {
      return res.status(400).json({ error: "Marks must be 0-100" });
    }

    const total = math + physics + chemistry;
    const percentage = (total / 300) * 100;
    let grade = "F";
    if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 35) grade = "D";

    const student = new Student({
      name,
      roll,
      marks: { math, physics, chemistry },
      total,
      percentage: Math.round(percentage * 100) / 100,
      grade
    });

    await student.save();
    res.json({ success: true, student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update student
app.put("/students/:roll", async (req, res) => {
  try {
    const roll = req.params.roll;
    const { name, marks } = req.body;
    const { math, physics, chemistry } = marks;

    if ([math, physics, chemistry].some(m => m < 0 || m > 100)) {
      return res.status(400).json({ error: "Marks must be 0-100" });
    }

    const total = math + physics + chemistry;
    const percentage = (total / 300) * 100;
    let grade = "F";
    if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 35) grade = "D";

    const updatedStudent = await Student.findOneAndUpdate(
      { roll },
      {
        name,
        marks: { math, physics, chemistry },
        total,
        percentage: Math.round(percentage * 100) / 100,
        grade
      },
      { new: true }
    );

    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true, student: updatedStudent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE student
app.delete("/students/:roll", async (req, res) => {
  try {
    const deleted = await Student.findOneAndDelete({ roll: req.params.roll });
    if (!deleted) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
