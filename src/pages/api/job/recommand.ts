// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { JobItem } from "types/job";

const jobRecommand = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = `
      SELECT * FROM JOB LIMIT 10
      `;
    const result = await excuteQuery({
      query,
      values: [],
    });

    const jobItemList: JobItem[] = JSON.parse(JSON.stringify(result));

    res.statusCode = 200;
    res.json({
      data: jobItemList,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      msg: error,
    });
  }
};

export default jobRecommand;
