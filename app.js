const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const { dirname } = require("path");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req,res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post('/', function (req, res) {
const firstName  = req.body.firstName;
const lastName  = req.body.lastName;    
const email  = req.body.email;    

const data = {
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
};

const jsonData = JSON.stringify(data)

const url = "https://us14.api.mailchimp.com/3.0/lists/128589e222"

// https://mailchimp.com/developer/marketing/api/lists/add-list/128589e222

const options = {
    method: "post",
    auth: "christina:d32698547c8d28558a87df495870ab26-us14"
}

const request = https.request(url, options,function(response){

    response.on("data", function(data){
        const returnData =  JSON.parse(data);
        console.log(returnData);
        const duplicateEmail = returnData.error_count

        if (duplicateEmail > 0)	{
            res.sendFile(__dirname + "/duplicate.html");
	} else if (response.statusCode === 200){
	    res.sendFile(__dirname + "/success.html");
	} else {
	    res.sendFile(__dirname + "/failure.html");
	}
	});
    })
    

request.write(jsonData);
request.end();

});

app.post('/failure', function (req, res) {

    res.redirect("/")

});

app.listen(process.env.PORT||3000, function() {
    console.log("server is running on port 3000")
});

// d32698547c8d28558a87df495870ab26-us14

// 