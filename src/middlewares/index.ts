import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const userAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
      .status(401)
      .json({
        status: 401,
        success: false,
        message: "Acces denied no token provided",
      });
    }
        const token = req.headers.authorization.split(" ")[1];
    
    
    const { userId } = jwt.verify(token, "secret") as JwtPayload;
    req.userId = userId;
    if (userId == "admin") {
      next();
    } else {
      res.status(401).json({
        
        message: "Unauthorized acces you dont have admin privileges",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Unauthorized / User not found / Please relogin or signup",
    });
  }
};
