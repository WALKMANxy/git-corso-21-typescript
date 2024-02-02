import express, { NextFunction, Request, Response } from "express";
import { connect } from "mongoose";
import { userName, password } from "./credentials";

const app = express();
const url = `mongodb+srv://${userName}:${password}@clustertest.c2xfuuc.mongodb.net/`;
import users from "./routes/users";
import companies from "./routes/companies";


const PORT = 3000;

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

app.listen(PORT, () => console.log(`Server is runnning on port: ${PORT}`));
