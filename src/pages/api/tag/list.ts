// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { TagItem } from "types/tag";

const applyList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = `
      SELECT id, tag
      FROM TAG
      `;
    const result = await excuteQuery({
      query,
      values: [],
    });

    const tagItemList: TagItem[] = JSON.parse(JSON.stringify(result));

    res.statusCode = 200;
    res.json({
      data: tagItemList,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      msg: error,
    });
  }
};

export default applyList;
