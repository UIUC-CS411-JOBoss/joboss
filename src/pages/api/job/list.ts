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
      SELECT j.id, j.title, c.name AS company, 
        j.location_states, j.location_countries, j.location_cities, 
        j.text_description, j.apply_start, j.expiration_date, 
        j.work_auth_required, j.remote, j.accepts_opt_cpt_candidates, 
        j.willing_to_sponsor_candidate, j.salary_type_name, j.tag_list,
        COUNT(CASE WHEN js.application_status = 'applied' THEN 1 ELSE null END) AS applied_count,
        COUNT(CASE WHEN js.application_status = 'OA' THEN 1 ELSE null END) AS oa_count,
        COUNT(CASE WHEN js.application_status = 'behavior interview' THEN 1 ELSE null END) AS behavior_interview_count,
        COUNT(CASE WHEN js.application_status = 'technical interview' THEN 1 ELSE null END) AS technical_interview_count,
        COUNT(CASE WHEN js.application_status = 'rejected' THEN 1 ELSE null END) AS rejected_count,
        COUNT(CASE WHEN js.application_status = 'offered' THEN 1 ELSE null END) AS offered_count
      FROM JOB AS j JOIN COMPANY AS c ON j.company_id = c.id JOIN JOB_STATUS AS js ON js.job_id = j.id
      WHERE c.name LIKE ?
      GROUP BY j.id
      ORDER BY company 
      LIMIT ?
      OFFSET ?
    `
      : `
      SELECT j.id, j.title, c.name AS company, 
        j.location_states, j.location_countries, j.location_cities, 
        j.text_description, j.apply_start, j.expiration_date, 
        j.work_auth_required, j.remote, j.accepts_opt_cpt_candidates, 
        j.willing_to_sponsor_candidate, j.salary_type_name, j.tag_list,
        COUNT(CASE WHEN js.application_status = 'applied' THEN 1 ELSE null END) AS applied_count,
        COUNT(CASE WHEN js.application_status = 'OA' THEN 1 ELSE null END) AS oa_count,
        COUNT(CASE WHEN js.application_status = 'behavior interview' THEN 1 ELSE null END) AS behavior_interview_count,
        COUNT(CASE WHEN js.application_status = 'technical interview' THEN 1 ELSE null END) AS technical_interview_count,
        COUNT(CASE WHEN js.application_status = 'rejected' THEN 1 ELSE null END) AS rejected_count,
        COUNT(CASE WHEN js.application_status = 'offered' THEN 1 ELSE null END) AS offered_count
      FROM JOB AS j JOIN COMPANY AS c ON j.company_id = c.id JOIN JOB_STATUS AS js ON js.job_id = j.id
      GROUP BY j.id
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
