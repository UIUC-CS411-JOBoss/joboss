// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { JobItem } from "types/job";

const jobRecommand = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = `
      SELECT JOB.id as job_id, COMPANY.name as company,JOB.title as job_title FROM JOB, COMPANY WHERE JOB.company_id = COMPANY.id LIMIT 10
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
