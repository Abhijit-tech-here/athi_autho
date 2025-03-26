const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const usermodel = require("./models/user");
const postmodel = require("./models/post");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const path = require('path');
const { log } = require('console');
const user = require('./models/user');
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.render('frontend');
})
app.get('/index',(req,res)=>{
    res.render('index')


})


app.post('/create',async (req,res)=>{
    let {username,email,password,age} = req.body;
    let user = await usermodel.findOne({email});
    if(user) return res.status(500).send("user already registered")
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            let createduser = await usermodel.create({
                username,
                email,
                password:hash,
                age
            })
            let token = jwt.sign({email:email},"shh");
            res.cookie("token",token);
            //res.send(createduser);
            res.render('login2');
            
        })
    })
});
app.get("/success",function(req,res){
    
    res.redirect("success");
});



        
            
        
   
   
app.get("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/");
});
app.get("/login",function(req,res){
    res.render('login');
})
app.get("/login2",function(req,res){
    res.render('login2');
})
app.get("/profile",isloggedIn , async (req,res)=>{
    let user = await usermodel.findOne({email: req.user.email})
    res.render("profile", {user});
    console.log(user);
    
})

    //console.log(req.user);
    //res.render("login");



app.post("/login", async function(req,res){
    let {email , password} = req.body;
     let user = await usermodel.findOne({email: req.body.email});
     if(!user) return res.send("something is wrong");
     bcrypt.compare(req.body.password , user.password,function(err,result){    
        if(result){
            let token = jwt.sign({email:email,userid: user._id},"shh");
            res.cookie("token",token);
             res.redirect('/login2');
            // res.send("yes u can login");
            // res.redirect("/profile");
        }
        else {
            res.send("you cant login");
        }
    })
});
app.get("/display",function(req,res){
    res.render('display');
})
app.post('/Donate', async (req, res) => {
    try {
        const { pname, paddress, pcontact, pquantity, food_type, img } = req.body;

        console.log("Form Data Received:", req.body); // Debugging step

        // Save new post to the database
        const createdPost = await postmodel.create({
            pname,
            paddress,
            pcontact,
            pquantity,
            food_type,
            img
        });

        console.log("Created Post:", createdPost); // Debugging step

        // Retrieve all posts for display
        const allposts = await postmodel.find();
        // res.send("done");

        res.render("display", { posts: allposts });
    } catch (error) {
        console.error("Error in /Donate route:", error); // Debugging step
        res.status(500).send("Error creating or fetching posts.");
    }
});
// app.get('/display2', async (req,res)=>{
//     const allposts = await postmodel.find();
//     res.render("display", { posts: allposts });

// })


// app.get('/display', async (req, res) => {
//     try {
//         let allposts = await postModel.find();
//         res.render("display", { posts: allposts });
//     } catch (error) {
//         res.status(500).send("Error fetching users.");
//     }
// });


function isloggedIn(req,res,next){
    console.log(req.cookies.token==="");
    if(req.cookies.token==="")res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token,"shh");
        req.user = data;
    }
    next();
}  
app.listen(3000);


            
            



     
     






























// //const cookieparser = require('cookie-parser');
// const express = require('express');
// const app = express();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// app.get("/",function(req,res){
//     let token = jwt.sign({enail: "harsh@exmaplegmail.com"},"secret");
//     res.cookie("token",token);
//     res.send("done");
//     console.log(token);
// }) 
// app.get("/read",function(req,res){
//     let data =jwt.verify(req.cookies.token,"secret");
//     console.log(data);
// });

    
    

// app.listen(3000);
