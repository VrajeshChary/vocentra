// Basic Jest test to fulfill Point 28 (Unit Tests Scaffold)
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SimilarityPanel from "../components/SimilarityPanel";

describe("SimilarityPanel Component", () => {
  it("renders without crashing even with no data", () => {
    const { container } = render(<SimilarityPanel data={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders overall score when data is provided", () => {
    const mockData = {
      similarity: {
        overall: 0.85,
        breakdown: { speech: 0.9, visual: 0.8, ocr: 0.95 },
      },
    };
    render(<SimilarityPanel data={mockData} />);
    expect(screen.getByText("85%")).toBeInTheDocument();
  });
});
