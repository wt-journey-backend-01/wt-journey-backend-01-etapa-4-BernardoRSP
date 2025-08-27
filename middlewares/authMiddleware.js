const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ status: 401, message: "Token Necessário" });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (erro) {
    return res.status(401).json({ status: 401, messaage: "Token Inválido" });
  }
}

module.exports = authMiddleware;
