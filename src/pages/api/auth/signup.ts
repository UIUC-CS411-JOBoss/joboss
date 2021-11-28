import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

import executeQuery from "../db/db";

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const { password } = req.body;

  const query = `
    INSERT INTO USER (email, reverse_email, token) VALUES (?, ?, ?)
  `;

  try {
    const token = await bcrypt.hash(password as string, 8);
    const value = [
      email,
      (email as string).split("").reverse().join(""),
      token,
    ];
    const records: unknown = await executeQuery(query, value);
    res.statusCode = 200;
    res.json({
      data: records,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      message: error,
    });
  }
};

export default signup;
