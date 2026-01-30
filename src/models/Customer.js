import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    companyName: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls if email is optional
    logo: { type: String }, // URL/path to the logo image
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model("Customer", CustomerSchema)
