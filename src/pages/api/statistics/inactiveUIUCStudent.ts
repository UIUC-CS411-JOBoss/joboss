import { NextApiRequest, NextApiResponse } from "next";

import executeQuery from "../db/db";

const inactiveUIUCStudent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const query = `
  SELECT u.id, u.email
  FROM USER u LEFT JOIN JOB_STATUS js ON u.id = js.user_id JOIN JOB j ON j.id = js.job_id \
  WHERE (DATE(js.create_at) <= CURDATE() - interval 1 month) AND u.email LIKE '%@illinois.edu' \
  GROUP BY u.id \
  HAVING COUNT(*) < 5 \
  ORDER BY u.email ASC LIMIT 15;
  `;
  try {
    const records: unknown = await executeQuery(query, null);
    res.statusCode = 200;
    res.json({
      data: records,
    });
  } catch (error) {
    res.statusCode = 500;
    res.json({
      message: error,
    });
  }
};

export default inactiveUIUCStudent;
