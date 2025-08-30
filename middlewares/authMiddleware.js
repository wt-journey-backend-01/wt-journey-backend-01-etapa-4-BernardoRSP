const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: 401, message: "Token Necessário" });
  }

  req.user = jwt.verify(token, process.env.JWT_SECRET, (error) => {
    if (error) {
      return res.status(401).json({ status: 401, message: "Token Inválido" });
    }
  });

  next();
}

module.exports = authMiddleware;
