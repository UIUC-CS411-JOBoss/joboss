// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { RecommendItem } from "types/recommend";

const jobRecommand = async (req: NextApiRequest, res: NextApiResponse) => {
  const postData = req.body;
  try {
    const query = `
      SELECT rj.related_job_id as job_id, j.title as job_title, c.name as company_name 
      FROM RELATED_JOB as rj JOIN JOB as j
      ON rj.related_job_id = j.id
      JOIN COMPANY as c 
      ON j.company_id = c.id 
      WHERE job_id = ${postData.job_id};
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
