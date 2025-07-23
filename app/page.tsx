"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const f = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const compute = (total: number, tipPercent: number) => {
  const totalCents = Math.round(total * 100);
  const tipCents = Math.round((totalCents * tipPercent) / 100);
  return [tipCents, totalCents + tipCents].map((cents) => cents / 100);
};

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(25);
  const [split, setSplit] = useState(1);

  const roundUp = () => {
    const [_, baseTotal] = compute(Number(bill), tipPercent);
    if (baseTotal === 0) return;
    const target = Math.ceil(baseTotal);
    const newTipPercent = ((target - Number(bill)) / Number(bill)) * 100;
    setTipPercent(newTipPercent);
  };

  const [tip, total] = compute(Number(bill), tipPercent);
  const splitTotal = total / split;

  return (
    <div className="flex min-h-screen flex-col gap-2 p-4">
      <div className="flex flex-col gap-1 rounded-lg border p-4">
        <div className="flex items-center">
          <Label className="flex-1 text-base whitespace-nowrap" htmlFor="bill">
            Bill:
          </Label>
          <div className="flex items-center gap-1">
            <div>$</div>
            <Input
              id="bill"
              name="bill"
              inputMode="decimal"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              placeholder="0.00"
              className="w-32 text-right"
              autoFocus
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between pe-3">
            <span>Tip:</span>
            <span>{f.format(tip)}</span>
          </div>
          <div className="flex items-center justify-between pe-3">
            <span>Total:</span>
            <span>{f.format(total)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <span>Tip %</span>
          <span>{tipPercent.toFixed(2)}%</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTipPercent(25)} className="flex-1">
            25%
          </Button>
          <Button onClick={() => setTipPercent(30)} className="flex-1">
            30%
          </Button>
        </div>
        <details>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-medium underline underline-offset-4">
            <span>Custom Tip %</span>
          </summary>
          <div className="flex flex-col gap-3 pt-3">
            <Input
              inputMode="numeric"
              id="tip-percent"
              name="tip-percent"
              type="number"
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value))}
              min="0"
              max="100"
            />
            <Slider
              value={[tipPercent]}
              onValueChange={(value) => setTipPercent(value[0])}
              max={50}
              step={1}
            />
          </div>
        </details>
      </div>
      <details className="rounded-xl border">
        <summary className="flex cursor-pointer items-center justify-between p-6">
          <span>Split</span>
          <div className="flex items-center gap-4">
            <span>{f.format(splitTotal)} per person</span>
            <span>
              {split} {split === 1 ? "person" : "people"}
            </span>
          </div>
        </summary>
        <div className="flex flex-col gap-4 p-6 pt-0">
          <div className="flex flex-col gap-3">
            <Label htmlFor="split">Number of People</Label>
            <Input
              id="split"
              name="split"
              inputMode="numeric"
              type="number"
              value={split}
              onChange={(e) => setSplit(Math.max(1, Number(e.target.value)))}
              min="1"
              max="20"
            />
          </div>
          <Slider
            value={[split]}
            onValueChange={(value) => setSplit(value[0])}
            min={1}
            max={20}
            step={1}
          />
        </div>
      </details>
      <Button onClick={roundUp} variant="secondary">
        Round Up
      </Button>
    </div>
  );
}
