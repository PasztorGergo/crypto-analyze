import { Interval, RestMarketTypes, Spot } from "@binance/connector-typescript";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { interval: startTime, symbol } = JSON.parse(JSON.stringify(req.body));
  const client = new Spot(process.env.BINANCE_PL, process.env.BINANCE_SK, {
    baseURL: process.env.BINANCE_BASE_URL || "",
  });
  const options: RestMarketTypes.uiklinesOptions = {
    limit: 5,
  };

  const uiklinesRes = await client.uiklines(symbol, Interval["1h"], options);
  return NextRequest.json(uiklinesRes);
}
