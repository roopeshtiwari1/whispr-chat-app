import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  if (!userId) {
    throw new Error("User ID is required to generate token");
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // console.log("userid", userId)
  // console.log("generate-Token", token)

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "lax", // CSRF attacks cross-site request forgery attacks
    secure: false,
  });

  return token;
};