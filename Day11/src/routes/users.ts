import express, { Request, Response } from "express";
const app = express.Router();
import { body, param, matchedData } from "express-validator";
import { User } from "../models/User";
import { checkValidation } from "../middlewares/validations";

app.get("/", async (_: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
});

app.get(
  "/:id",
  param("id")
  .isMongoId(),
  checkValidation,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }
);

app.put(
  "/:id",
  param("id").isMongoId(),
  body("name").trim(),
  body("email").isEmail(),
  body("avatar").optional().trim(),
  checkValidation,
  async (req: Request, res: Response) => {
    await User.findByIdAndUpdate(req.params.id, matchedData(req));
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }
);

app.delete(
  "/:id",
  param("id").isMongoId(),
  checkValidation,
  async (req: Request, res: Response) => {
    const user = await User.deleteOne({ _id: req.params.id });
    if (user.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  }
);

app.post(
  "/",
  body("name").trim(),
  body("email").isEmail(),
  body("avatar").optional().trim(),
  body("address)"),
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const user = new User(matchedData(req));
      const userCreated = await user.save();
      res.json(userCreated);
    } catch (err) {
      res.status(409).json(err);
    }
  }
);

export default app;
