import { describe, expect, it } from "vitest";
import { normalizeStrokes } from "./clinicianReviewUtils";

describe("normalizeStrokes", () => {
  it("wraps flat point arrays as one stroke", () => {
    expect(normalizeStrokes([{ x: 1, y: 2 }, { x: 3, y: 4, time: 50 }])).toEqual([
      [
        { x: 1, y: 2, time: 0, pressure: 0.5, pointerType: "touch" },
        { x: 3, y: 4, time: 50, pressure: 0.5, pointerType: "touch" },
      ],
    ]);
  });

  it("keeps nested stroke arrays", () => {
    expect(normalizeStrokes([[{ x: 1, y: 2, pressure: 1, pointerType: "pen" }]])).toEqual([
      [{ x: 1, y: 2, time: 0, pressure: 1, pointerType: "pen" }],
    ]);
  });

  it("extracts strokes from raw task payload objects", () => {
    expect(normalizeStrokes({ strokes: [{ x: 5, y: 6 }] })).toEqual([
      [{ x: 5, y: 6, time: 0, pressure: 0.5, pointerType: "touch" }],
    ]);
  });
});
