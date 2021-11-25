// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { JobItem } from "types/job";

const jobList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const pageSize = 20;
    const { company, page } = req.query;
    const query = company
      ? `
      SELECT j.id, j.title, c.name AS company, j.location_states, j.text_description, j.apply_start, j.expiration_date
      FROM JOB AS j JOIN COMPANY AS c ON j.company_id = c.id 
      WHERE c.name LIKE ?
      ORDER BY company 
      LIMIT ?
      OFFSET ?
    `
      : `
      SELECT j.id, j.title, c.name AS company, j.location_states, j.text_description, j.apply_start, j.expiration_date
      FROM JOB AS j JOIN COMPANY AS c ON j.company_id = c.id 
      ORDER BY company 
      LIMIT ?
      OFFSET ?;
    `;
    const values = company
      ? [`${company}%`, pageSize, pageSize * Number(page)]
      : [pageSize, pageSize * Number(page)];

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
