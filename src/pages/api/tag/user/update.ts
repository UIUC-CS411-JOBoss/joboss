// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../../db";

const updateUserTag = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const tagIdString = req.body as string;
  const userId = 1;
  const tagIdList = tagIdString.split(",").map((tagId) => {
    return `(${userId}, ${tagId})`;
  });

  const insertValues = tagIdList.join(",");
  try {
    const deleteQuery = `DELETE FROM USER_PREFERRED_TAG WHERE user_id = ${userId}`;
    const insertQuery = `
        INSERT INTO USER_PREFERRED_TAG(user_id, tag_id)
        VALUES ${insertValues}
      `;
    await excuteQuery({
      query: deleteQuery,
      values: [],
    });
    await excuteQuery({
      query: insertQuery,
      values: [],
    });

    res.statusCode = 200;
    res.json({
      msg: `get ${tagIdString}`,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      msg: error,
    });
  }
};

export default updateUserTag;
