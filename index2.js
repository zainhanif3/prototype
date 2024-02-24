const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;
const hbs = require("hbs");
const session = require("express-session");
const passport = require("passport");

mongoose.connect("mongodb://localhost:27017/prototype", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  fatherName: String,
  cnic: String,
  contactNumber: String,
  address: String,
  disputePerson: {
    name: String,
    fatherName: String,
    contactNumber: String,
    address: String,
    disputeType: String,
  },
});

const User1 = mongoose.model("User1", {
  name: String,
  email: String,
  password: String,
  fatherName: String,
  cnic: String,
  contactNumber: String,
  address: String,
  disputePerson: {
    name: String,
    fatherName: String,
    contactNumber: String,
    address: String,
    disputeType: String,
  },
});

const Admin = mongoose.model("Admin", {
  name: String,
  email: String,
  password: String,
});

console.log(__dirname, "views");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.get("/adduser", (req, res) => {
  res.render("adduser");
});

app.get("/user", (req, res) => {
  res.render("user");
});

app.get("/password", (req, res) => {
  res.render("password");
});

app.get("/portal", (req, res) => {
  res.render("portal");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/adminsignin", (req, res) => {
  res.render("adminsignin");
});

app.get("/admin", (req, res) => {
  if (req.user.admin) {
    res.render("admin");
  } else {
    res.redirect("signin");
  }
});
app.get("/users", (req, res) => {
  res.render("users");
});

app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      fatherName: req.body.fatherName,
      cnic: req.body.cnic,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      disputePerson: {
        name: req.body.disputePersonName,
        fatherName: req.body.disputePersonFatherName,
        contactNumber: req.body.disputePersonContactNumber,
        address: req.body.disputePersonAddress,
        disputeType: req.body.disputeType,
      },
    });

    await newUser.save();
    res.redirect("/signin");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/adduser", async (req, res) => {
  try {
    const newUser = new User1({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      fatherName: req.body.fatherName,
      cnic: req.body.cnic,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      disputePerson: {
        name: req.body.disputePersonName,
        fatherName: req.body.disputePersonFatherName,
        contactNumber: req.body.disputePersonContactNumber,
        address: req.body.disputePersonAddress,
        disputeType: req.body.disputeType,
      },
    });

    await newUser.save();
    res.redirect("/admin");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/user/:cnic", async (req, res) => {
  try {
    const cnic = req.params.cnic;
    const user = await User.findOne({ cnic });
    console.log(user);
    res.send(`
      ${user.name}
      ${user.cnic}
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.send(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (user.password === password) {
      res.status(200).redirect("/portal");
    } else {
      res.send("Password does not match");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/adminsignin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (admin.password === password) {
      res.status(200).redirect("/admin");
    } else {
      res.send("Password does not match");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.render("users", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
