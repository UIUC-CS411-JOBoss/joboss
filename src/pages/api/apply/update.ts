import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { ApplyItem } from "types/apply";

const applyUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const newApply = req.body as ApplyItem;

  try {
    const query =
      "UPDATE JOB_STATUS SET status_date = ?, application_status = ?, update_at = ? WHERE id = ?";
    await excuteQuery({
      query,
      values: [
        new Date(newApply.date),
        newApply.status,
        new Date(),
        newApply.id,
      ],
    });
    // console.log(result);
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

export default applyUpdate;
