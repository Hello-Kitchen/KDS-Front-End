import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonSet, { GenericButton } from '../Components/Buttons/Buttons';

jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn(),
}));

describe('ButtonSet Component', () => {
    // Mock the setConfig function
    const setConfigMock = jest.fn();
    const updateActiveTabMock = jest.fn();

    test('renders all buttons with correct text', () => {
        const buttons = ['servie', 'precedent', 'suivant', 'rappel', 'statistique', 'reglage', 'activer'];

        render(<ButtonSet isServing={() => {}} buttons={buttons} setConfig={setConfigMock} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}} activeRecall={true} updateActiveRecall={() => {}} />);

        // Check that each button's text is present
        expect(screen.getByText("SERVIE")).toBeInTheDocument();
        expect(screen.getByText("PRÉCÉDENT")).toBeInTheDocument();
        expect(screen.getByText("SUIVANT")).toBeInTheDocument();
        expect(screen.getByText("RAPPEL")).toBeInTheDocument();
        expect(screen.getByText("STATISTIQUES")).toBeInTheDocument();
        expect(screen.getByText("RÉGLAGES")).toBeInTheDocument();
        expect(screen.getByText("ACTIVER")).toBeInTheDocument();
    });

    test('Button click triggers updateActiveTab', () => {
        const buttons = ['servie', 'precedent', 'suivant', 'rappel'];

        render(<ButtonSet isServing={() => {}} buttons={buttons} setConfig={setConfigMock} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}} activeRecall={true} updateActiveRecall={() => {}} />);

        const buttonElement = screen.getByText("RAPPEL");

        // Fire a click event on the SERVIE button
        fireEvent.click(buttonElement);

        // Verify that updateActiveTab was called with the correct argument
        expect(updateActiveTabMock).toHaveBeenCalledWith("RAPPEL");
    });

    test('ButtonPower toggles configuration on click', () => {
        const buttons = ['activer'];
        render(<ButtonSet isServing={() => {}} buttons={buttons} setConfig={setConfigMock} activeTab="" updateActiveTab={() => {}} navigationPrev={() => {}} navigationAfter={() => {}} activeRecall={true} updateActiveRecall={() => {}} />);

        const buttonElement = screen.getByText("ACTIVER");

        // Fire a click event on the power button
        fireEvent.click(buttonElement);

        // Verify that setConfigMock was called
        expect(setConfigMock).toHaveBeenCalledTimes(1);

        // Verify that the function passed to setConfig was called with the previous configuration
        const previousConfig = { enable: true };
        const toggleFunction = setConfigMock.mock.calls[0][0];
        const newConfig = toggleFunction(previousConfig);

        // Ensure that the config is toggled correctly
        expect(newConfig.enable).toBe(false);
    });

    test('Button click applies color inversion for invertOnClick=true', () => {
        const buttons = ['servie', 'precedent', 'suivant'];

        render(<ButtonSet isServing={() => {}} buttons={buttons} setConfig={setConfigMock} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}} activeRecall={true} updateActiveRecall={() => {}} />);

        const buttonElement = screen.getByText("SERVIE");

        // Initially, it should have a default color class
        expect(buttonElement).toHaveClass('text-white'); // Replace with actual default class

        // Fire mouse down event to simulate color inversion
        fireEvent.mouseDown(buttonElement);

        // The class should change indicating color inversion (assuming bg-kitchen-yellow is the active color)
        expect(buttonElement).toHaveClass('text-kitchen-blue');

        // After click, the button color should toggle back (or remain active)
        fireEvent.mouseUp(buttonElement);

        expect(buttonElement).toHaveClass('text-white'); // Ensure it's back to the default color
    });

    test('Button click triggers updateActiveTab for different buttons', () => {
        const buttons = ['rappel', 'statistique', 'reglage'];

        render(<ButtonSet isServing={() => {}} buttons={buttons} setConfig={setConfigMock} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}} activeRecall={true} updateActiveRecall={() => {}} handleDisplayStatistics={() => {}} handleSettingsDisplay={() => {}}/>);

        // Fire click events on each of the buttons
        fireEvent.click(screen.getByText("RAPPEL"));
        expect(updateActiveTabMock).toHaveBeenCalledWith("RAPPEL");

        fireEvent.click(screen.getByText("STATISTIQUES"));
        expect(updateActiveTabMock).toHaveBeenCalledWith("STATISTIQUES");

        fireEvent.click(screen.getByText("RÉGLAGES"));
        expect(updateActiveTabMock).toHaveBeenCalledWith("RÉGLAGES");
    });
});

describe('GenericButton Component', () => {

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('Click on "SERVIE" updates the status of food if they\'re not ready', async () => {

        // Mock the fetch call to return a successful response
        global.fetch = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                food_ordered: [{ id: 1, is_ready: false }, { id: 2, is_ready: true }]
            })
        }))
        .mockImplementation(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
            })
        }));

        const { getByText } = render(
          <GenericButton
            label="SERVIE"
            icon="checkmark"
            activeTab=""
            updateActiveTab={() => {}}
            navigationPrev={() => {}}
            navigationAfter={() => {}}
            handleSettingsDisplay={() => {}}
            currentOrderId={123} // Simulate an order ID
            invertOnClick={true}
            isServing={() => {}}
          />
        );

        // Simulate clicking the SERVIE button
        fireEvent.click(getByText('SERVIE'));

        await new Promise((resolve) => setTimeout(resolve, 0));

        let fetchCall = global.fetch.mock.calls; // URL passée à fetch

        expect(fetchCall[0][0]).toEqual(expect.stringContaining("/orders/123"));
        // console.log(global.fetch.mock.calls)
        // fetchCall = global.fetch.mock.calls[1][0]

        expect(fetchCall[1][0]).toEqual(expect.stringContaining('/orders/status/1'));
        expect(fetchCall[1][0]).not.toEqual(expect.stringContaining('/orders/status/2'));
    });

    test('Click on "SERVIE" deletes the order if it\'s ready', async () => {

        global.fetch = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
            food_ordered: [{ id: 1, is_ready: true }, { id: 2, is_ready: true }]
            })
        }));

        const { getByText } = render(
        <GenericButton
            label="SERVIE"
            icon="checkmark"
            activeTab=""
            updateActiveTab={() => {}}
            navigationPrev={() => {}}
            navigationAfter={() => {}}
            handleSettingsDisplay={() => {}}
            currentOrderId={123} // Simulate an order ID
            invertOnClick={true}
            isServing={() => {}}
        />
        );

        fireEvent.click(getByText('SERVIE'));

        let fetchCalls = global.fetch.mock.calls;

        expect(fetchCalls[0][0]).toEqual(expect.stringContaining("/orders/123"));

        expect(fetchCalls).toHaveLength(1);
    });
});
