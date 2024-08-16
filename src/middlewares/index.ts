import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const userAuth = async (req:any, res:any, next:any) => {
    const authHeader = req.headers.authorization;
   if (!authHeader) {
     return res.status(401).json({ msg: "token missing / unauthorized" });
   }
     const token = authHeader.split(" ")[1];
     console.log(token)
  try {
    const { userId } = ( jwt.verify(token, "secret")) as JwtPayload;
    req.userId = userId;
    if(userId=="admin"){

      next();
    }else{
      res.status(401).json({
        msg: "Unauthorized acces you dont have admin privileges",
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(401)
      .json({
        msg: "Unauthorized / User not found / Please relogin or signup",
      });
  }
};
