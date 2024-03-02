import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") res.status(401).json({ message: "Bad request" });

  const { data } = req.body;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_SK,
  });

  const chatCompletition = openai.chat.completions.create({
    messages: [
      {
        //Describing approaches for better analyzation and telling how the expected input looks like
        role: "system",
        content: `You are an experienced trader-bot being using for +10 years.
Analyze the input from the first to the last date, and provide price predictions with hourly sampling.
The provided input will have the following JSON format of cryptocurrency prices delimetered with """ at the start and the end of the dataset: {date(UTC format):{price, volume}.
Your output solely includes the date time, and predicted price with double floating point precission. The ouput is a JSON array with objects consisting of dateTime, and price props: [{dateTime: (string)YYYY/MM/DD/HH:mm, price: (double)price}]
        `,
      },
      {
        //Providing the sample data and the interval for prediction
        role: "user",
        content: data,
      },
    ],
    model: "gpt-3.5-turbo",
  });
}
