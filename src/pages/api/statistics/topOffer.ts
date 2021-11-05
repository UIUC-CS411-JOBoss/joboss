import { NextApiRequest, NextApiResponse } from "next";

const topOffer = (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.json({
    data: [{ dummy: "1" }, { dummy: "2" }],
  });
};

export default topOffer;
