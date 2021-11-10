import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { ApplyItem } from "types/apply";

const applyCreate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const newApply = req.body as ApplyItem;
  try {
    const query =
      "INSERT INTO JOB_STATUS (job_id, user_id, status_date, application_status) VALUES (?, ?, ?, ?)";
    const values = [
      newApply.jobId,
      newApply.userId,
      newApply.date,
      newApply.status,
    ];

    await excuteQuery({
      query,
      values,
    });

    res.statusCode = 200;
    res.json({
      msg: `get ${JSON.stringify(newApply)}`,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      msg: error,
    });
  }
};

export default applyCreate;
