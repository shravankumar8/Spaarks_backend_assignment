import jwt from "jsonwebtoken";
export const genToken = (req:any, res:any) => {
  const { userId, email } = req.body;
  try {
    const token = jwt.sign({ userId, email }, process.env.ACCESS_TOKEN_SECRECT!);
    res.json({ message: "token generated succesfully", token });
  } catch (error) {
    console.error(`Error in while generating token  method: ${error}`);
    // throw error; // Propagate the error to be handled in the route
    return {
      status: 500,
      success: false,
      message: error,
    };
  }
};
