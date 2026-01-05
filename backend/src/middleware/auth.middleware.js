const jwt = require("jsonwebtoken");

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers && req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (
        allowedRoles.length > 0 &&
        (!decoded.role || !allowedRoles.includes(decoded.role))
      ) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
