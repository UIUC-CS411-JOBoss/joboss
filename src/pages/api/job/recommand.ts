// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { RecommendItem } from "types/recommend";

const jobRecommand = async (req: NextApiRequest, res: NextApiResponse) => {
  const postData = req.body;
  try {
    const query = `
      CALL recommend(${postData.job_id}, ${postData.user_id});
      `;
    const result = await excuteQuery({
      query,
      values: [],
    });

    const jobItemList: RecommendItem[] = JSON.parse(JSON.stringify(result));

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
