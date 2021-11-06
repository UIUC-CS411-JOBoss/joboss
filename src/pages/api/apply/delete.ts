import { NextApiRequest, NextApiResponse } from "next";

import excuteQuery from "../db";
import type { ApplyItem } from "types/apply";

const applyDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const newApply = req.body as ApplyItem;
  try {
    const query = "DELETE FROM JOB_STATUS WHERE id = ?";
    await excuteQuery({
      query,
      values: [newApply.id],
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

export default applyDelete;
