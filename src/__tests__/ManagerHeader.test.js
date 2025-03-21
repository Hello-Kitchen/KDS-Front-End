import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ManagerHeader from "../ModalViews/ManagerHeader";

describe("ManagerHeader Component", () => {
    const mockOnClick = jest.fn();

    it("renders the title correctly", () => {
        render(<ManagerHeader title="Test Title" onClick={mockOnClick} />);
        const titleElement = screen.getByText("Test Title");
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveClass("font-bold text-3xl text-white");
    });

    it("calls onClick when the header is clicked", () => {
        render(<ManagerHeader title="Test Title" onClick={mockOnClick} />);
        const headerElement = screen.getByText("Test Title").closest("div");
        fireEvent.click(headerElement);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});