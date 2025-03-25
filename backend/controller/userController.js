//db conn
const jwt = require("jsonwebtoken");
const dbConn = require("../DB/dbConfig");
const bcrypt = require("bcrypt");

const { StatusCodes } = require("http-status-codes");
async function register(req, res) {
  const { username, first_name, last_name, email, password } = req.body;

  if (!username || !first_name || !last_name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const [existingUser] = await dbConn.query(
      "select userid,username from users where username=? or email=?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "User already existed",
      });
    }
    //   return res.json({
    //     user:existingUser
    //   })
    if (password.length <= 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertUser =
      "INSERT INTO users ( username, first_name, last_name, email, password) VALUE (?,?,?,?,?)";

    await dbConn.query(insertUser, [
      username,
      first_name,
      last_name,
      email,
      hashedPassword,
    ]);

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
    });
  } catch (error) {
    // console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something Went Wrong .try again later!",
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const [user] = await dbConn.query(
      "select email,userid ,username ,password from users where  email=? ",
      [email]
    );



    if (user.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    const isMatched = await bcrypt.compare(password, user[0].password);
    if (!isMatched) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid username or password",
    
      });
    }

    // console.log(user)
// console.log(process.env.JWT_SECRET)
    const userName = user[0].username;
    const userId = user[0].userid;
// console.log(userNa)

    const token=jwt.sign(
      {
        userName,
        userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({

      message:"user login successfully",token,userName

    })
  } catch (error) {
    // console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something Went Wrong .try again later!",
    });
  }
}

async function checkUser(req,  res) {
  const user = req.user;
  // console.log(user)
res.send({

  user:user,
  message:"User Verified"
})
}

module.exports = { register, login, checkUser };
