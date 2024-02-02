import { Schema, model } from "mongoose";

type Company = {
    name: string;
    industry: string;
    email: string;
    address: string;
    
  };

  const companySchema = new Schema<Company>({
    name: { type: String, required: true },
    industry: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
  });

  export const Company = model<Company>("Company", companySchema)