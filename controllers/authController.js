const { userValidation } = require("../utils/authUtils");
const User = require("../models/userModel");
const bcypt = require("bcrypt");

const registerController = async(req,res) => {
    const {name, email, password, username} = req.body;

    try{
      await userValidation({email, password, username});
    }
    catch(err)
    {
      console.log(err);
      return res.send({
        status: 400,
        message: "Data Invalid",
        error: err,
      })
    }

    const userModelObj = new User({name,email,password,username});

    try
    {
       const userDb = await userModelObj.register();

       return res.send({
        status: 201,
        message: "User Registered Successfully",
        data: userDb,
       })
    }
    catch(err)
    {
       return res.send({
        status: 500,
        message: "Internal Server Error",
        data: err,
       })
    }
}

const loginController = async(req,res) => {
  const {loginId, password} = req.body;
  try
  {
    const user = await User.findUserWithLoginID(loginId);

    const userPassword = user.password;

    const isPasswordMatched = await bcypt.compare(password, userPassword);

    if(!isPasswordMatched)
    {
      return res.send({
        status: 400,
        message: "Incorrect Password",
      })
    }

    req.session.isAuth = true,
    req.session.user = {
      username: user.username,
      email: user.email,
      userId: user._id
    }

    return res.send({
      status: 200,
      message: "Login Successfull",
      data: user,
    })
  }
  catch(err)
  {
      return res.send({
        status: 500,
        message: "Internal server error",
        data: err,
      })
  }
}


const logoutController = (req,res) => {
  req.session.destroy((err) => {
    if(err)
    {
      return res.send({
        status: 400,
        message: "logout unsuccessfull",
        data: err,
      })
    }
    return res.send({
      status: 200,
      message: "logout successfull",
    })
  });
}


module.exports = {registerController, loginController, logoutController};