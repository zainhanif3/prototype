const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const port = 3000;
const hbs = require ("hbs")
const session = require ('express-session');
const passport = require ('passport')

mongoose.connect('mongodb://localhost:27017/prototype', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('views', express.static('views'))

//user model
const User = mongoose.model('User', {
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
        disputeType: String
    }
});

//admin model
const Admin = mongoose.model('Admin', {
    name: String,
    email: String,
    password: String,
    
});

console.group(__dirname, "views" );
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
//router
app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/signup', (req, res)=>{
    res.render('signup')
})
app.get('/signin', (req, res)=>{
    res.render('signin')
})
app.get('/password', (req, res)=>{
    res.render('password')
})
// Render the user registration page
app.get('/signup', (req, res) => {
    res.render('signup');
});
//render the main user portal page

app.get('/portal',(req,res)=>{
    res.render('portal')
});
app.get('/admin',(req,res)=>{
    res.render('admin')
});
app.get('/adminsignin',(req,res)=>{
    res.render('adminsignin')
});

app.get('/admin', (req, res) => {
    if (req.user.admin) {
      res.render('admin');
    } else {
      res.redirect('/signin');
    }
  });

// Handle user registration
app.post('/register', async (req, res) => {
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
                disputeType: req.body.disputeType
            }
        });

        await newUser.save();
        res.redirect('/signin'); // Redirect to portal or any other page
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});




//sign in check
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
  

    if (!user) {
      return res.status(401).json({ message: 'Invalid email ' });
    }

    // Compare the provided password with the hashed password stored in the database
    

    if (user.password === password) {
      res.status(200).redirect('/portal');
      
    }else{
      res.send("password not match");
    }
    
    
   

    // Redirect to the portal page after successful sign-in
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//adminsign in check
app.post('/adminsignin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const admin = await Admin.findOne({ email });
      
    
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid email ' });
      }
  
      // Compare the provided password with the hashed password stored in the database
      
  
      if (admin.password === password) {
        res.status(200).redirect('/admin');
        
      }else{
        res.send("password not match");
      }
      
      
     
  
      // Redirect to the portal page after successful sign-in
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
//cases detail


const Case = mongoose.model('Case', {
    title: String,
    description: String,
});

// Render cases page
app.get('/cases', async (req, res) => {
    const cases = await Case.find();
    res.render('cases', { cases });
});

// Render add case form
app.get('/cases/add', (req, res) => {
    res.render('add-case');
});

// Add a new case
app.post('/cases/add', async (req, res) => {
    const { title, description } = req.body;
    const newCase = new Case({ title, description });
    await newCase.save();
    res.redirect('/cases');
});

// Render update case form
app.get('/cases/update/:id', async (req, res) => {
    const caseToUpdate = await Case.findById(req.params.id);
    res.render('update-case', { caseToUpdate });
});

// Update an existing case
app.post('/cases/update/:id', async (req, res) => {
    const { title, description } = req.body;
    await Case.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect('/cases');
});

// Delete a case
app.post('/cases/delete/:id', async (req, res) => {
    await Case.findByIdAndRemove(req.params.id);
    res.redirect('/cases');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

