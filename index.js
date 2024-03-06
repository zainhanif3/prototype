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
app.use("views", express.static("views"));
//user model
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
//user1 model
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
//admin model
const Admin = mongoose.model("Admin", {
  name: String,
  email: String,
  password: String,
});
console.group(__dirname, "views");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
//router
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
// Render the user registration page
app.get("/signup", (req, res) => {
  res.render("signup");
});
//render the main user portal page
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
    res.redirect("/signin");
  }
});
app.get("/users", (req, res) => {
  res.render("users");
});

// Handle user registration
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
    res.redirect("/signin"); // Redirect to portal or any other page
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ADD USER
app.post("/adduser", async (req, res) => {
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
    res.redirect("/admin"); // Redirect to portal or any other page
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Define DRCMember schema
const drcMemberSchema = new mongoose.Schema({
  name: String,
  position: String,
});

// Create DRCMember model
const DRCMember = mongoose.model("DRCMember", drcMemberSchema);

// Routes
app.get("/drcmembers", async (req, res) => {
  try {
    const members = await DRCMember.find();
    res.render("drcmembers", { members });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/drcmembers", async (req, res) => {
  const { name, position } = req.body;

  try {
    await DRCMember.create({ name, position });
    res.redirect("/drcmembers");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/drcmembers/:id/delete", async (req, res) => {
  const memberId = req.params.id;

  try {
    await DRCMember.findByIdAndDelete(memberId);
    res.redirect("/drcmembers");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Update route
app.get('/drcmembers/:id/update', async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await DRCMember.findById(memberId);

    res.render('update-member', { member });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Form for updating members
app.get('/drcmembers/:id/update', async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await DRCMember.findById(memberId);

    res.render('update-member', { member });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle member updates
app.post('/drcmembers/:id/update', async (req, res) => {
  try {
    const memberId = req.params.id;
    const updatedData = {
      name: req.body.name,
      position: req.body.position,
    };

    await DRCMember.findByIdAndUpdate(memberId, updatedData);
    res.redirect('/drcmembers'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});





//sign in check
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email " });
    }

    // Compare the provided password with the hashed password stored in the database

    if (user.password === password) {
      res.status(200).redirect("/portal");
    } else {
      res.send("password not match");
    }

    // Redirect to the portal page after successful sign-in
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//adminsign in check
app.post("/adminsignin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email " });
    }

    // Compare the provided password with the hashed password stored in the database

    if (admin.password === password) {
      res.status(200).redirect("/admin");
    } else {
      res.send("password not match");
    }

    // Redirect to the portal page after successful sign-in
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

//add update and delete user

app.get("/user", async (req, res) => {
  const users = await User.find();
  res.render("user", { users });
});

app.post("/add-user", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email,password});
  await newUser.save();
  res.redirect("/user");
});

app.put("/update-user/:id", async (req, res) => {
  const { name, email } = req.body;
  await User.findByIdAndUpdate(req.params.id, { name, email, });
  res.redirect("/user");
});

app.delete("/delete-user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/user");
});
app.get('/fetch-users', async (req, res) => {
  // Fetch all users from MongoDB
  const users = await User.find();
  res.json(users);
});

app.get("/search", async (req, res) => {
  const { searchTerm, searchType } = req.query;
  let users;

  switch (searchType) {
    case "name":
      users = await User.find({ name: new RegExp(searchTerm, "i") });
      break;
    case "email":
      users = await User.find({ email: new RegExp(searchTerm, "i") });
      break;
    case "cnic":
      users = await User.find({ cnic: new RegExp(searchTerm, "i") });
      break;
    case "number":
      users = await User.find({ contactNumber: new RegExp(searchTerm, "i") });
      break;

    // Add more cases for other search types (e.g., number, cnic)

    default:
      users = await User.find();
  }

  res.render("user", { users });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
