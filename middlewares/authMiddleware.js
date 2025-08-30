const jwt = require("jsonwebtoken");
const APIError = require("../utils/errorHandler.js");

function authMiddleware(req, res, next) {
  try {
    const cookieToken = req.cookies?.access_token;
    const authHeader = req.headers["authorization"];
    const headerToken = authHeader && authHeader.split(" ")[1];

    const token = cookieToken || headerToken;

    if (!token) {
      return next(new ApiError("access_token não fornecido.", 401, { access_token: "access_token nao fornecido" }));
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return next(new ApiError("access_token inválido ou expirado.", 401, { access_token: error.message }));
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return next(new ApiError("Error authenticating user", 401, error.message));
  }
}

module.exports = authMiddleware;
