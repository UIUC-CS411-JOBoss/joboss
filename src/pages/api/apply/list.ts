// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { ApplyItem } from "types/apply";

const applyList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query =
      "SELECT s.id, s.user_id AS userId, s.job_id AS jobId, j.title, c.name AS company, s.status_date AS date, s.application_status AS status, s.create_at AS createAt, s.update_at AS updateAt FROM JOB_STATUS AS s JOIN JOB AS j ON s.job_id = j.id JOIN COMPANY AS c ON j.company_id = c.id WHERE s.user_id = 1";
    const result = await excuteQuery({
      query,
      values: [],
    });

    const applyItemList: ApplyItem[] = JSON.parse(JSON.stringify(result));

    res.statusCode = 200;
    res.json({
      data: applyItemList,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      msg: error,
    });
  }
};

export default applyList;
