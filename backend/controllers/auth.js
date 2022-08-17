import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(createError(400, "Name, Eamil or Password are required"));
  }
  //todo after project try making everything into string using to string
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(201)
      .json(`new user created with name - ${req.body.name}`);
  } catch (e) {
    console.log(e);
    if (e.code == 11000) {
      return next(createError(400, "email already used bosh"));
    }
    return next(err);
  }
};

export const login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(createError(400, "email and password are required"));
  }
  try {
    const user = await User.findOne({
      email: req.body.email,
    }).select("name email password");
    if (!user) {
      return next(createError(404, "no such user found"));
    }
    const IsPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!IsPasswordCorrect) {
      return next(createError(400, "password is incorect"));
    }
    const payload = {
      id: user._id,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json("login sucess");
  } catch (e) {
    console.log(e);
    return next(createError(500, "some error occured"));
  }
};

export const logout = async (req, res, next) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json("logged out");
};

export const isLoggedIn = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json(false);
  }
  return jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.json(false);
    }
    return res.json(true);
  });
};
