import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "../pages/Homepage";

describe("HomePage", () => {
  test("renders title and CTA button", () => {
    render(<HomePage onCreateTree={jest.fn()} />);

    // Be explicit: look for the heading element, not the label span
    expect(
      screen.getByRole("heading", {
        name: /My Christmas Wish Tree/i,
        level: 1,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Create Your Wish Tree/i })
    ).toBeInTheDocument();
  });

  test("calls onCreateTree when CTA button is clicked", () => {
    const handleCreate = jest.fn();
    render(<HomePage onCreateTree={handleCreate} />);

    const button = screen.getByRole("button", {
      name: /Create Your Wish Tree/i,
    });

    fireEvent.click(button);

    expect(handleCreate).toHaveBeenCalledTimes(1);
  });
});
