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
  useNewUrlParser: true,
  useUnifiedTopology: true,
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



// Set up a route to fetch user data by CNIC
app.get('/users/:cnic', async (req, res) => {
  try {
    const cnic = req.params.cnic;

    // Find user by CNIC
    const user = await User.findOne({ cnic });
    console.log(user)
    // Render HTML response
    res.send(`
      
              ${user.name}
              ${user.cnic}
          
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
  

// delete data
app.delete('/delete/:cnic' , function(req,res){
  let delcnic=req.params.cnic;
  User.findOneAndDelete(({cnic:delcnic}), function(err,docs) {
    res.send(docs)
  })

})

















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


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
