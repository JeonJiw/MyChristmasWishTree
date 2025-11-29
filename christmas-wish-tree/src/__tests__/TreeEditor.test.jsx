import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TreeEditor from "../pages/TreeEditor";

describe("TreeEditor", () => {
  const baseTree = {
    treeId: "tree_1",
    treeName: "My Christmas Wish Tree",
    ornaments: [],
  };

  const renderEditor = (overrides = {}) => {
    const props = {
      tree: baseTree,
      onAddGift: jest.fn(),
      onUpdateGift: jest.fn(),
      onDeleteGift: jest.fn(),
      onShare: jest.fn(),
      onBack: jest.fn(),
      ...overrides,
    };

    render(<TreeEditor {...props} />);
    return props;
  };

  test("renders gift form", () => {
    renderEditor();

    expect(screen.getByText(/Add a new gift/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Nintendo Switch/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
  });

  test("submits form and calls onAddGift with gift data", () => {
    const handlers = renderEditor();

    fireEvent.change(screen.getByPlaceholderText(/Nintendo Switch/i), {
      target: { value: "AirPods" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Animal Crossing edition/i), {
      target: { value: "Noise cancelling" },
    });

    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "300" },
    });

    fireEvent.change(screen.getByPlaceholderText("https://..."), {
      target: { value: "https://example.com" },
    });

    // change priority to High
    const select = screen.getByDisplayValue(/Medium/i);
    fireEvent.change(select, { target: { value: "high" } });

    const submitButton = screen.getByRole("button", {
      name: /Add gift/i,
    });
    fireEvent.click(submitButton);

    expect(handlers.onAddGift).toHaveBeenCalledTimes(1);

    const payload = handlers.onAddGift.mock.calls[0][0];
    expect(payload.giftName).toBe("AirPods");
    expect(payload.description).toBe("Noise cancelling");
    expect(payload.price).toBe(300);
    expect(payload.link).toBe("https://example.com");
    expect(payload.priority).toBe("high");
  });
});
