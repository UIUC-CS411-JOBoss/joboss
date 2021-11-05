import { NextApiRequest, NextApiResponse } from "next";

import type { ApplyItem } from "types/apply";

const applyCreate = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const newApply = req.body as ApplyItem;
  res.statusCode = 200;
  res.json({
    msg: `get ${JSON.stringify(newApply)}`,
  });
};

export default applyCreate;
