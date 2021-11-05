// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import type { JobItem } from "types/job";

const jobList = (req: NextApiRequest, res: NextApiResponse) => {
  const { company } = req.query;
  let jobItemList: JobItem[] = [
    { title: "SWE", company: "Facebook" },
    { title: "SWE", company: "Google" },
  ];
  if (company && typeof company === "string") {
    jobItemList = jobItemList.filter((x) => x.company.search(company) >= 0);
  }
  res.statusCode = 200;
  res.json({
    data: jobItemList,
  });
};

export default jobList;
