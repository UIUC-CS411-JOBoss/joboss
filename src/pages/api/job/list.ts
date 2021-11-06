// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { JobItem } from "types/job";

const jobList = async (req: NextApiRequest, res: NextApiResponse) => {
  const { company } = req.query;

  try {
    const query =
      "SELECT j.title, c.name AS company FROM JOB AS j JOIN COMPANY AS c ON j.company_id = c.id ORDER BY company LIMIT 50";
    const result = await excuteQuery({
      query,
      values: [],
    });

    let jobItemList: JobItem[] = JSON.parse(JSON.stringify(result));
    if (company && typeof company === "string") {
      jobItemList = jobItemList.filter((x) => x.company.search(company) >= 0);
    }

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
