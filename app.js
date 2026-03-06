const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    secret:"lab-secret",
    resave:false,
    saveUninitialized:true
}))

// Test users
const users = {
    admin:{password:"admin123"},
    victim:{password:"victim123"}
}

let OTP_STORE = {}

function generateOTP(){
    return Math.floor(100000 + Math.random()*900000).toString()
}



// LOGIN PAGE
app.get("/",(req,res)=>{

res.send(`
<html>

<head>

<title>2FA Lab</title>

<style>

body{
background:#0f172a;
font-family:Arial;
color:white;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.card{
background:#1f2937;
padding:40px;
border-radius:10px;
width:350px;
}

input{
width:100%;
padding:10px;
margin-top:10px;
border:none;
border-radius:5px;
}

button{
width:100%;
padding:12px;
margin-top:15px;
background:#2563eb;
border:none;
color:white;
border-radius:5px;
cursor:pointer;
}

button:hover{
background:#1d4ed8;
}

.info{
margin-top:20px;
font-size:14px;
background:#111827;
padding:10px;
border-radius:5px;
}

</style>

</head>

<body>

<div class="card">

<h2>🔐 2FA Practice Lab</h2>

<form method="POST" action="/login">

<input name="username" placeholder="Username">

<input type="password" name="password" placeholder="Password">

<button>Login</button>

</form>

<div class="info">

Test Accounts<br><br>

admin / admin123<br>
victim / victim123

</div>

</div>

</body>

</html>
`)
})



// LOGIN
app.post("/login",(req,res)=>{

const {username,password} = req.body

if(users[username] && users[username].password === password){

req.session.logged=true
req.session.user=username

const otp = generateOTP()

OTP_STORE[username] = otp

res.send(`
<html>

<head>

<style>

body{
background:#0f172a;
font-family:Arial;
color:white;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.card{
background:#1f2937;
padding:40px;
border-radius:10px;
width:350px;
}

input{
width:100%;
padding:10px;
margin-top:10px;
border:none;
border-radius:5px;
}

button{
width:100%;
padding:12px;
margin-top:15px;
background:#16a34a;
border:none;
color:white;
border-radius:5px;
}

.logout{
background:#dc2626;
}

.debug{
background:#111827;
padding:10px;
margin-top:15px;
border-radius:5px;
}

</style>

</head>

<body>

<div class="card">

<h2>OTP Verification</h2>

<p>Enter the OTP sent to your device</p>

<div class="debug">

Debug OTP (intentional vulnerability): <b>${otp}</b>

</div>

<form method="POST" action="/verify-otp">

<input name="otp" placeholder="Enter OTP">

<button>Verify OTP</button>

</form>

<form method="POST" action="/logout">

<button class="logout">Logout</button>

</form>

</div>

</body>

</html>
`)

}else{

res.send("Invalid login")

}

})



// VERIFY OTP
app.post("/verify-otp",(req,res)=>{

let user = req.session.user
let correctOTP = OTP_STORE[user]

let otp = req.body.otp

// arbitrary input bypass
if(otp=="0" || otp=="null"){
req.session.otp=true
}

// normal validation
if(otp === correctOTP){

req.session.otp=true

res.redirect("/dashboard")

}else{

res.send("OTP incorrect")

}

})



// DASHBOARD
app.get("/dashboard",(req,res)=>{

if(req.session.logged){

res.send(`
<html>

<head>

<style>

body{
background:#0f172a;
font-family:Arial;
color:white;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.card{
background:#1f2937;
padding:40px;
border-radius:10px;
width:400px;
text-align:center;
}

button{
padding:10px;
width:100%;
margin-top:15px;
background:#dc2626;
border:none;
color:white;
border-radius:5px;
}

.links{
margin-top:20px;
background:#111827;
padding:10px;
border-radius:5px;
font-size:14px;
}

a{
color:#60a5fa;
text-decoration:none;
}

</style>

</head>

<body>

<div class="card">

<h2>Dashboard</h2>

Welcome ${req.session.user}

<div class="links">

Practice Endpoints<br><br>

<a href="/secure">Referrer Check Page</a><br>
<a href="/ip-protected">IP Protected Page</a>

</div>

<form method="POST" action="/logout">

<button>Logout</button>

</form>

</div>

</body>

</html>
`)

}else{

res.send("Login required")

}

})




// REFERRER CHECK
app.get("/secure",(req,res)=>{

if(req.headers.referer == "http://localhost:3000/otp"){

res.send("Access granted via referrer")

}else{

res.send("Access denied")

}

})




// IP HEADER BYPASS
app.get("/ip-protected",(req,res)=>{

let ip = req.headers["x-forwarded-for"]

if(ip == "127.0.0.1"){

res.send("Internal request allowed")

}else{

res.send("Access denied")

}

})




// LOGOUT
app.post("/logout",(req,res)=>{

req.session.destroy(()=>{

res.redirect("/")

})

})



app.listen(3000,()=>{

console.log("2FA Lab running at http://localhost:3000")

})