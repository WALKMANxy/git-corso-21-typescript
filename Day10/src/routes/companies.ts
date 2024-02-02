import express, { Request, Response } from "express";
const app = express.Router();
import { body, param, matchedData } from "express-validator";
import { checkValidation } from "../middlewares/validations";
import { Company } from "../models/Company";

app.get("/", async (_: Request, res: Response) => {
  const companies = await Company.find();
  res.json(companies);
});

app.get(
  "/:id",
  param("id")
  .isMongoId(),
  checkValidation,
  async (req: Request, res: Response) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  }
);

app.put(
  "/:id",
  param("id").isMongoId(),
  body("name").trim(),
  body("industry").trim(),
  body("email").isEmail(),
  body("address").trim(),

  checkValidation,
  async (req: Request, res: Response) => {
    await Company.findByIdAndUpdate(req.params.id, matchedData(req));
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  }
);

app.delete(
  "/:id",
  param("id").isMongoId(),
  checkValidation,
  async (req: Request, res: Response) => {
    const company = await Company.deleteOne({ _id: req.params.id });
    if (company.deletedCount === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company deleted" });
  }
);

app.post(
  "/",
  body("name").trim(),
  body("industry").trim(),
  body("email").isEmail(),
  body("address").trim(),

  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const company = new Company(matchedData(req));
      const companyCreated = await company.save();
      res.json(companyCreated);
    } catch (err) {
      res.status(409).json(err);
    }
  }
);

export default app;
