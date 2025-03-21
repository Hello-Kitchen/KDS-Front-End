import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccountManagement from "../ModalViews/AccountManagement";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("AccountManagement Component", () => {
    const mockNavigate = jest.fn();
    const mockOnClickBack = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        localStorage.clear();
    });

    test("calls onClickBack when ManagerHeader back button is clicked", () => {
        render(
            <AccountManagement onClickBack={mockOnClickBack} />,
            { wrapper: MemoryRouter }
        );

        const backButton = screen.getByText("Gestion du compte");
        fireEvent.click(backButton);

        expect(mockOnClickBack).toHaveBeenCalledTimes(1);
    });

    test("logs out and navigates to home on logout button click", () => {
        render(
            <AccountManagement onClickBack={mockOnClickBack} />,
            { wrapper: MemoryRouter }
        );

        const logoutButton = screen.getByText("Déconnexion");
        fireEvent.click(logoutButton);

        expect(localStorage.getItem("token")).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});