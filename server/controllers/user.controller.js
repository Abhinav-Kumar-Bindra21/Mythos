import { validateUser } from "../utils/validateUser.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

//Api to register user
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields must be filled" });
    }

    validateUser(req.body);

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ fullName, email, password: hashedPassword });

    generateToken(newUser._id, res);

    res.status(201).json({ success: true, message: "User register successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//Api to login user

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Fields is missing" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//api to logout

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//api to getUser data

export const getUser = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
