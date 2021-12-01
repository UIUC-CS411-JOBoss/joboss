import { NextApiRequest, NextApiResponse } from "next";

import executeQuery from "../db/db";

const jobUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const { updatedText } = req.body;
  const { jobId } = req.body;
  try {
    const query = `UPDATE JOB SET text_description = ? WHERE id = ?`;
    await executeQuery(query, [updatedText, jobId]);
    res.statusCode = 200;
    res.json({
      msg: `upadted job ${JSON.stringify(jobId)}`,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      msg: error,
    });
  }
};

export default jobUpdate;
