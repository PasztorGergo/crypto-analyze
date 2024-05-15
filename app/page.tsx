import { Interface } from "@/components";
import { Interval, RestMarketTypes, Spot } from "@binance/connector-typescript";
import OpenAI from "openai";

export default async function Home() {
  return (
    <main className="min-h-fit">
      <Interface />
    </main>
  );
}
