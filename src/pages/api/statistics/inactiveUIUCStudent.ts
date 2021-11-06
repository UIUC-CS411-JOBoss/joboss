import { NextApiRequest, NextApiResponse } from "next";
import executeQuery from "../db/db";

const inactiveUIUCStudent = async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  const query = `
  SELECT u.id, u.email
  FROM USER u LEFT JOIN JOB_STATUS js ON u.id = js.user_id JOIN JOB j ON j.id = js.job_id \
  WHERE (DATE(js.create_at) <= CURDATE() - interval 1 month)
  GROUP BY u.id \
  HAVING COUNT(*) < 5 \
  ORDER BY u.email ASC LIMIT 15;
  `;
  const records:any = await executeQuery(query, null);
  res.json({
    data: records,
  });
};

export default inactiveUIUCStudent;
