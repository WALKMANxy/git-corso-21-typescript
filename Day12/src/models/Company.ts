import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export type Company = {
  _id: string;
  name: string;
  industry: string;
  email: string;
  password: string;
  address: string;
};

export type CompanyDocument = Document & Company;

const companySchema = new Schema<CompanyDocument>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  industry: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
});

// Hash the password before saving to the database
companySchema.pre<CompanyDocument>("save", async function (next) {
  const company = this;
  if (company.isModified("password") || company.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(company.password, salt);
    company.password = hash;
  }
  next();// You can add similar password hashing logic here if needed

});

export const Company = model<CompanyDocument>("Company", companySchema);
