import { Interval, RestMarketTypes, Spot } from "@binance/connector-typescript";
import OpenAI from "openai";

async function getMarketData() {
  const dateObject = new Date();

  const year = dateObject.getFullYear();
  const month = dateObject.getMonth();
  const date = dateObject.getDate();
  const hour = dateObject.getHours();
  const minute = dateObject.getMinutes();
  const second = dateObject.getSeconds();
  const ms = dateObject.getMilliseconds();

  const UTCDate = Date.UTC(year, month, date - 5, hour, minute, second, ms);

  const client = new Spot(process.env.BINANCE_PL, process.env.BINANCE_SK, {
    baseURL: process.env.BINANCE_BASE_URL || "",
  });
  const options: RestMarketTypes.uiklinesOptions = {
    startTime: UTCDate,
  };

  const uiklinesRes = await client.uiklines("WLDUSDT", Interval["1h"], options);
  const mapped = uiklinesRes.map((x) => ({
    date: x[0] as number,
    price: x[4] as string,
    volume: x[5] as string,
  }));

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_SK,
  });

  const chatCompletition = openai.chat.completions.create({
    messages: [
      {
        //Describing approaches for better analyzation and telling how the expected input looks like
        role: "system",
        content: `You are an experienced trader-bot being using for +10 years.
Analyze the input from the first to the last date, and provide price predictions with hourly sampling for the next 3 days.
The provided input will have the following JSON format of cryptocurrency prices delimetered with """ at the start and the end of the dataset: {date(UTC format):{price, volume}.
Your output solely includes the date time, and predicted price with double floating point precission. The ouput is a JSON array with objects consisting of dateTime, and price props: [{dateTime: (string)YYYY/MM/DD/HH:mm, price: (double)price}]`,
      },
      {
        //Providing the sample data and the interval for prediction
        role: "user",
        content: `${mapped}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return (await chatCompletition).choices[0].message.content;
}

export default async function Home() {
  const marketData = await getMarketData();
  return (
    <main className="">
      <pre>{marketData}</pre>
    </main>
  );
}
