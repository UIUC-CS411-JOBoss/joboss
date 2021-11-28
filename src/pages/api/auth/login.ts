import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

import executeQuery from "../db/db";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const { password } = req.body;

  if (!email || !password) {
    res.statusCode = 400;
    res.json({
      message: "invalid input",
    });
  }

  const query = `
    SELECT id, email, token FROM USER WHERE email = ?
  `;

  try {
    const value = [email];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await executeQuery(query, value);
    if (!(await bcrypt.compare(password, user[0].token))) {
      res.statusCode = 400;
      res.json({
        message: "password incorrect",
      });
    }

    res.statusCode = 200;
    res.json({
      data: {
        id: user[0].id,
        email: user[0].email,
      },
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      message: error,
    });
  }
};

export default login;
