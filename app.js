const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
 
 
const mailchimp = require('@mailchimp/mailchimp_marketing');
const { restart } = require("nodemon");
 
mailchimp.setConfig({
  apiKey: 'c60ac942bad8b26c8a05e7ec3104ad00-us10',
  server: 'us10',
});
 
 
const app = express();
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html")
  });
 
app.post("/", function(req, res) {
 
  var firstName = req.body.fName
  var lastName = req.body.lName
  var email =req.body.email
 
  
  const run = async () => {
    const response = await mailchimp.lists.batchListMembers("8cb2405f52", {
      members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }],
    });     
  };
  run().then(
    (f) => {
      console.log("Success!");
      res.sendFile(__dirname + "/success.html");
    },
    (r) => {
      console.log("Unsuccessful.");
      res.sendFile(__dirname + "/failure.html");
    });
});
 
app.post('/failure', (req, res) => {
    res.redirect('/');
});
 
 
app.listen(process.env.PORT || 3000, function() {
    console.log("server started")    
});
 



// api key for Mailchimp 
// c60ac942bad8b26c8a05e7ec3104ad00-us10

// list ID for mailchimp
// 8cb2405f52
