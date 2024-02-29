import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") res.status(401).json({ message: "Bad request" });

  const { interval, symbol } = req.body;
}
