import express, { NextFunction, Request, Response } from "express";
import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, PORT = 3000 } = process.env;
const url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/`;
import users from "./routes/users";
import companies from "./routes/companies";
import auth from "./routes/auth";



connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Couldn't connect to MongoDB: ${err}`);
  });

app.use(express.json());
app.use("/users", users);
app.use("/companies", companies);
app.use("/auth", auth);

app.listen(PORT, () => console.log(`Server is runnning on port: ${PORT}`));
