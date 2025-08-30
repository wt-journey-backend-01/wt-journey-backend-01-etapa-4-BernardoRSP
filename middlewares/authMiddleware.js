const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const cookieToken = req.cookies?.access_token;
    const authHeader = req.headers["authorization"];
    const headerToken = authHeader && authHeader.split(" ")[1];

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ status: 401, message: "Token Inválido" });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ status: 401, message: "Token Não fornecido" });
      }

      req.user = user;
      next();
    });
  } catch (erro) {
    return res.status(401).json({ status: 401, message: "Token Inválido" });
  }
}

module.exports = authMiddleware;
