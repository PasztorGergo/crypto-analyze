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
  console.log(UTCDate);
  const data = await fetch("localhost:3000/api/binance/", {
    method: "POST",
    body: JSON.stringify({
      symbol: "BNBUSDT",
      interval: UTCDate,
    }),
  });

  return data.json().then((x) => x);
}

export default async function Home() {
  const marketData = await getMarketData();
  console.log(marketData);
  return (
    <main className="">
      <pre>{marketData}</pre>
    </main>
  );
}
