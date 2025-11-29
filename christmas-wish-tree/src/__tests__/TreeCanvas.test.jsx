import React from "react";
import { render, screen } from "@testing-library/react";
import TreeCanvas from "../components/TreeCanvas";

describe("TreeCanvas", () => {
  test("renders the tree image", () => {
    render(<TreeCanvas ornaments={[]} isPreview={true} variant="home" />);

    const img = screen.getByAltText(/Christmas tree/i);
    expect(img).toBeInTheDocument();
  });

  test("renders ornaments with gift name and price when not in preview", () => {
    const ornaments = [
      {
        id: "orn_1",
        giftName: "AirPods",
        price: 300,
        link: "https://example.com",
      },
      {
        id: "orn_2",
        giftName: "Book",
        price: 25,
      },
    ];

    render(
      <TreeCanvas ornaments={ornaments} isPreview={false} variant="editor" />
    );

    expect(screen.getByText("AirPods")).toBeInTheDocument();
    expect(screen.getByText("Book")).toBeInTheDocument();

    // Price labels (may be formatted like $300 or $300.00)
    expect(screen.getByText(/\$300/)).toBeInTheDocument();
    expect(screen.getByText(/\$25/)).toBeInTheDocument();
  });
});
