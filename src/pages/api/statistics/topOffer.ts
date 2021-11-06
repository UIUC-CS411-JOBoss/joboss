import { NextApiRequest, NextApiResponse } from "next";

import executeQuery from "../db/db";

const topOffer = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = `
  SELECT SQL_NO_CACHE company.id, company.name, COUNT(*) AS num_of_offer \
  FROM JOB_STATUS AS status JOIN JOB AS job ON status.job_id = job.id JOIN COMPANY AS company ON job.company_id = company.id \
  WHERE status.create_at LIKE '202%' AND status.application_status = 'offered' \
  GROUP BY company.id, company.name \
  ORDER BY num_of_offer DESC LIMIT 15;
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

export default topOffer;
