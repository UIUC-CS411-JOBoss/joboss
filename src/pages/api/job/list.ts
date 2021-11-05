// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

const jobList = (req: NextApiRequest, res: NextApiResponse) => {
  const { company } = req.query;
  let companyList = [
    { title: "SWE", company: "Facebook" },
    { title: "SWE", company: "Google" },
  ];
  if (company && typeof company === "string") {
    companyList = companyList.filter((x) => x.company.search(company) >= 0);
  }
  res.statusCode = 200;
  res.json({
    data: companyList,
  });
};

export default jobList;
