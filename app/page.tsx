import { Interval, RestMarketTypes, Spot } from "@binance/connector-typescript";

async function getMarketData() {
  const dateObject = new Date();

  const year = dateObject.getFullYear();
  const month = dateObject.getMonth();
  const date = dateObject.getDate();
  const hour = dateObject.getHours();
  const minute = dateObject.getMinutes();
  const second = dateObject.getSeconds();
  const ms = dateObject.getMilliseconds();

  const UTCDate = Date.UTC(year, month, date - 2, hour, minute, second, ms);

  const client = new Spot(process.env.BINANCE_PL, process.env.BINANCE_SK, {
    baseURL: process.env.BINANCE_BASE_URL || "",
  });
  const options: RestMarketTypes.uiklinesOptions = {
    startTime: UTCDate,
  };

  const uiklinesRes = await client.uiklines("WLDUSDT", Interval["1h"], options);
  return uiklinesRes.map((x) => ({
    date: x[0] as number,
    price: x[4] as string,
    volume: x[5] as string,
  }));
}

export default async function Home() {
  const marketData = await getMarketData();
  console.log(marketData.length);
  return (
    <main className="">
      <pre>
        {marketData.map(({ date, price, volume }) => (
          <p>
            {date}
            {"\t"}
            {parseFloat(price).toPrecision(3)}
            {"\t"}
            {parseFloat(volume).toFixed(3)}
          </p>
        ))}
      </pre>
    </main>
  );
}
