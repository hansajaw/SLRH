const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* -------------------- USER SCHEMA -------------------- */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Hide password by default
    },
    fullName: { type: String }, // ✅ Added fullName
    phone: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    zip: { type: String },
    avatarUri: { type: String },
    caption: { type: String },
  },
  { timestamps: true }
);

/* -------------------- PASSWORD HASHING -------------------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* -------------------- PASSWORD COMPARISON -------------------- */
userSchema.methods.correctPassword = async function (candidate, stored) {
  return await bcrypt.compare(candidate, stored);
};

/* -------------------- EXPORT -------------------- */
module.exports = mongoose.model("User", userSchema);
