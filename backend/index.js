import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import allRoutes from "./routes/index.js";

const PORT = process.env.PORT || 3000;
const DB_CONNECTION_URI = process.env.DB_CONNECTION_URI;

const app = express();
const CLIENT_URL_STRING = process.env.CLIENT_URL || 'https://todoist-mern.vercel.app';

const allowedDomains = CLIENT_URL_STRING.split(', ');
console.log(allowedDomains);
//middleware
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api", allRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message, stack: err.stack });
});

const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_URI);
    console.log("mongodb connected");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  connectDB();
  console.log(PORT);
});
