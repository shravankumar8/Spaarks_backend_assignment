import jwt from "jsonwebtoken";
export const genToken = (req:any, res:any) => {
  const { userId, email } = req.body;
  try {
    const token = jwt.sign({ userId, email }, "secret");
    res.json({ message: "token generated succesfully", token });
    
  } catch (error) {
    console.log("error", error);
  }
};
