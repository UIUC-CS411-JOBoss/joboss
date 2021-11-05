// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import type { ApplyItem } from "types/apply";

const applyList = (req: NextApiRequest, res: NextApiResponse) => {
  const applyItemList: ApplyItem[] = [
    {
      id: 1,
      jobId: 100,
      title: "SWE",
      company: "Google",
      date: "2021/09/20",
      status: "OA",
      updateAt: "2021/09/25",
      createAt: "2021/09/25",
    },
    {
      id: 2,
      jobId: 100,
      title: "SWE",
      company: "Google",
      date: "2021/09/20",
      status: "OFFER",
      updateAt: "2021/10/1",
      createAt: "2021/10/1",
    },
  ];
  res.statusCode = 200;
  res.json({
    data: applyItemList,
  });
};

export default applyList;
