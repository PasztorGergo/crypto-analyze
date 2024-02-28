import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") res.status(401).json({ message: "Bad request" });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_SK,
  });

  const chatCompletition = openai.chat.completions.create({
    messages: [
      {
        //Describing approaches for better analyzation and telling how the expected input looks like
        role: "system",
        content: "",
      },
      {
        //Providing the sample data and the intervall for prediction
        role: "user",
        content: "",
      },
    ],
    model: "gpt-3.5-turbo",
  });
}
