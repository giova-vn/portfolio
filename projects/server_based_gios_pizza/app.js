const express = require('express');         //import express.js
const fs = require("fs");                   //import fs, file system operations
const fileUpload = require('express-fileupload');  //file upload package

const session = require("express-session");
const crypto = require("crypto");

const app = express();                     

//__dirname + absolute path
app.use(express.static(__dirname + '/static'));    
app.use(express.urlencoded({                       
        extended: true
}));

app.use(express.json());

//middleware to handle files
app.use(fileUpload({
    //maximun size of 1mb
    limits: {fileSize: 1 * 1024 *1024}
}))

//middleware forsessions
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: crypto.randomBytes(16).toString("hex"),
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}))

// Map routes to all .js files in the /routes folder.
fs.readdirSync("./routes").map((filename) => {             
    const module = require("./routes/" + filename);        
    const route = filename.replace(".js", "");               
    app.use("/" + route, module);                           
});

//server started
app.listen(3000, () => console.log("server working..."));   