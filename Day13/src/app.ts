import express, { NextFunction, Request, Response } from "express";
import { connect } from "mongoose";
import dotenv from "dotenv";
import path from 'path';


dotenv.config({
  path: path.join(__dirname, `../env/${process.env.NODE_ENV}`)
});


const app = express();
const { MONGODB, PORT = 3003 } = process.env;
const url = `${MONGODB}`;
import users from "./routes/users";
import companies from "./routes/companies";
import auth from "./routes/auth";




export const connection = connect(url)
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;