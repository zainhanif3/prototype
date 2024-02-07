const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require(path)
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/prototype', { useNewUrlParser: true, useUnifiedTopology: true });

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


app.use(bodyParser.urlencoded({ extended: true }));
// app.set('view engine', 'html');

// Render the user registration page
app.get('/views/signup', (req, res) => {
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
        res.redirect('/portal'); // Redirect to portal or any other page
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
