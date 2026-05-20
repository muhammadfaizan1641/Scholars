import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

  try {

    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No token"
      });
    }

    // Bearer TOKEN_HERE
    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

export default auth;