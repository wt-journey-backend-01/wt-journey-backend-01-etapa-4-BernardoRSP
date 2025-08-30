const jwt = require("jsonwebtoken");
const ApiError = require("../utils/errorHandler.js");

function authMiddleware(req, res, next) {
  try {
    const cookieToken = req.cookies?.access_token;
    const authHeader = req.headers["authorization"];
    const headerToken = authHeader && authHeader.split(" ")[1];

    const token = cookieToken || headerToken;

    if (!token) {
      return next(new ApiError("access_token não fornecido.", 401, { access_token: "access_token nao fornecido" }));
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: "token inválido" });
  }
}

module.exports = authMiddleware;
