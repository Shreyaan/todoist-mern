import jwt from "jsonwebtoken";
import createError from "./createError.js";

export default (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "unauthorized"));
  }
  return jwt.verify(token, process.env.JWT_SECRET, (err, decodedMsg) => {
    if (err) {
      return next(createError(401, "Unauthorized, invalid token"));
    } else {
      req.user = decodedMsg;
      return next();
    }
  });
};
