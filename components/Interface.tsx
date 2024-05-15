"use client";
import { Datum } from "@/types";
import React, { useMemo, useState } from "react";
import { Chart, AxisOptions } from "react-charts";

export const Interface = () => {
  const [series, setSeries] = useState<{ data: Datum[]; label: string }[]>([]);
  const [symbol, setSymbol] = useState<string>("BTC");
  const [loading, setLoading] = useState<boolean>(false);

  const primaryAxis = useMemo(
    (): AxisOptions<Datum> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );
  const secondaryAxes = useMemo(
    (): AxisOptions<Datum>[] => [
      {
        getValue: (datum) => datum.price,
        elementType: "line",
      },
    ],
    []
  );
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    fetch("/api/predict/", {
      method: "POST",
      body: JSON.stringify({ symbol }),
    })
      .then((x) => {
        if (x.ok) {
          x.json().then((res) => {
            console.log(res);
            let out = JSON.parse(res?.data);
            console.log(out);
            setSeries([{ data: out, label: symbol }]);
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <section className="min-h-56 flex flex-col w-full gap-16">
      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <input
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value);
          }}
          id="symbol"
          type="text"
          placeholder="Symbol"
          className="bg-black outline-none border-2 border-white p-1 rounded-md"
        />
        <button
          className="px-3 py-1 bg-white text-black hover:bg-black hover:text-white border-white border-2 rounded-md"
          type="submit"
        >
          Predict
        </button>
      </form>
      <div className="h-56">
        {loading ? (
          <div className="h-16 w-16 animate-spin rounded-full border-2 border-cyan-900 border-l-cyan-500"></div>
        ) : series.length > 0 ? (
          <Chart
            options={{
              primaryAxis,
              secondaryAxes,
              data: series,
              dark: true,
            }}
          />
        ) : (
          <h2>No data was provided</h2>
        )}
      </div>
    </section>
  );
};
