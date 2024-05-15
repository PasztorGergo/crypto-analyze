import { Interface } from "@/components";
import { Interval, RestMarketTypes, Spot } from "@binance/connector-typescript";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SK,
});

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
  console.log(year, month, date);
  const client = new Spot(process.env.BINANCE_PL, process.env.BINANCE_SK, {
    baseURL: process.env.BINANCE_BASE_URL || "",
  });
  const options: RestMarketTypes.uiklinesOptions = {
    startTime: UTCDate,
  };

  const symbol = "BTC";
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
  console.log(uiklinesRes);
  console.log(mapped);
  console.log(new Date(UTCDate).toUTCString());

  const chatCompletition = openai.chat.completions.create({
    messages: [
      {
        //Describing approaches for better analyzation and telling how the expected input looks like
        role: "system",
        content: `You are an experienced cryptocurrency day-trader with +10 years of experience.
Based on the given JSON input, delimetered with """, create a JSON array of ${symbol} price predictions for the upcoming 3 days with hourly sampling, staring from ${new Date(
          Date.UTC(year, month, date, hour, minute, second, ms)
        ).toUTCString()}.
Your output must only be a JSON array consisting of object with the properties for date(YYYY/MM/DD/HH:mm format) and price(double)`,
      },
      {
        //Providing the sample data and the interval for prediction
        role: "user",
        content: `Analyze the following prices and use common chart patterns to generate a proper result.
"""${mapped}"""`,
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.75,
  });

  return (await chatCompletition).choices[0].message.content;
}

export default async function Home() {
  const marketData = await getMarketData();

  const mapped = JSON.parse(
    marketData
      ?.split("```")
      .find((x) => x.includes("json"))
      ?.replace("json", "") || ""
  );

  return (
    <main className="">
      <Interface
        series={[
          {
            data: mapped,
            label: "BTC",
          },
        ]}
      />
    </main>
  );
}
