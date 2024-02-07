const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const port = 3000;
const hbs = require ("hbs")

mongoose.connect('mongodb://localhost:27017/prototype', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('views', express.static('views'))


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


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

