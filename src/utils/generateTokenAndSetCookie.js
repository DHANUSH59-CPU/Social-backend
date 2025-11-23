const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = async (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  // Environment-aware cookie settings
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    path: "/",
    // In production (deployed on HTTPS, different domain), we must use
    // SameSite=None and Secure=true to allow cross-site cookies.
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  };

  // Optional: allow overriding cookie domain via env var when needed
  if (isProd && process.env.COOKIE_DOMAIN) {
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  res.cookie("token", token, cookieOptions);

  return token;
};

module.exports = { generateTokenAndSetCookie };
