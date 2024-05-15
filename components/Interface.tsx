"use client";
import { Datum } from "@/types";
import React, { useMemo } from "react";
import { Chart, AxisOptions } from "react-charts";

export const Interface = ({
  series,
}: {
  series: { data: Datum[]; label: string }[];
}) => {
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
  return (
    <section className="h-56">
      <Chart
        options={{
          primaryAxis,
          secondaryAxes,
          data: series,
          dark: true,
        }}
      />
    </section>
  );
};
