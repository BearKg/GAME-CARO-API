const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new UnauthenticatedError(
      "Unauthorized: Missing Authorization Token!"
    );
  }
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const testAdmin = decoded.isAdmin;
    const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
    if (decoded.exp && currentTime > decoded.exp) {
      throw new UnauthenticatedError("Unauthorized: Token has expired!");
    }
    req.user = { userId: decoded.userId, testAdmin };
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authenticate;
