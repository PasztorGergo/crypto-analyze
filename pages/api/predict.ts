import { Interval, RestMarketTypes, Spot } from "@binance/connector-typescript";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(403).send("Wrong method");
    return;
  } else {
    const { symbol } = JSON.parse(req.body);
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_SK,
    });
    const dateObject = new Date();

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const date = dateObject.getDate();
    const hour = dateObject.getHours();
    const minute = dateObject.getMinutes();
    const second = dateObject.getSeconds();
    const ms = dateObject.getMilliseconds();

    const startDate = Date.UTC(year, month, date - 5, hour, minute, second, ms);
    const endDate = Date.UTC(year, month, date, hour, minute, second, ms);
    const client = new Spot(process.env.BINANCE_PL, process.env.BINANCE_SK, {
      baseURL: process.env.BINANCE_BASE_URL || "",
    });
    const options: RestMarketTypes.uiklinesOptions = {
      startTime: startDate,
      endTime: endDate,
    };
    const uiklinesRes = await client.uiklines(
      `${symbol}USDT`,
      Interval["1h"],
      options
    );
    const mapped = JSON.stringify(
      uiklinesRes.map((x) => ({
        date: x[0] as number,
        price: x[4] as string,
      }))
    );

    const chatCompletition = openai.chat.completions.create({
      messages: [
        {
          //Describing approaches for better analyzation and telling how the expected input looks like
          role: "system",
          content: `You are a crypto-currency day-trader with +10 years of experience. You can recognize common chart patterns effectively. The user is providing you an array of json object having date and price propeties. Create a JSON array of the forcasted ${symbol} prices for the upcoming 3 days with hourly sampling. The output array consists of 72 objects with date(YYYY/MM/DD/HH:mm) and price(double) properties. The input is delimetered with """ and your output with ${"```"} `,
        },
        {
          //Providing the sample data and the interval for prediction
          role: "user",
          content: `Analyze the following prices. The result must start on ${endDate}
    """${mapped}"""`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 1.1,
    });

    const data = (
      await chatCompletition
    ).choices[0].message.content?.replaceAll("`", "");
    res.status(200).json({ data });
  }
}
