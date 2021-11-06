// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { JobItem } from "types/job";

const jobList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { company } = req.query;
    const query = company
      ? `
      SELECT j.title, c.name AS company 
      FROM JOB AS j JOIN COMPANY AS c ON j.company_id = c.id 
      WHERE c.name LIKE ?
      ORDER BY company 
      LIMIT 50
    `
      : `
      SELECT j.title, c.name AS company 
      FROM JOB AS j JOIN COMPANY AS c ON j.company_id = c.id 
      ORDER BY company 
      LIMIT 50
    `;
    const values = company ? [`${company}%`] : [];

    const result = await excuteQuery({
      query,
      values,
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

export default jobList;
