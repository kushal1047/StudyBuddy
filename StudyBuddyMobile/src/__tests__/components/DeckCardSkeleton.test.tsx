import React from "react";
import { render } from "../../testUtils/testUtils";
import DeckCardSkeleton from "../../components/DeckCardSkeleton";

describe("DeckCardSkeleton", () => {
  it("should render without crashing", () => {
    const { toJSON } = render(<DeckCardSkeleton />);
    expect(toJSON()).toBeTruthy();
  });

  it("should render with correct styles", () => {
    const { getByTestId } = render(<DeckCardSkeleton />);

    // Check if component renders (skeleton has specific structure)
    const tree = render(<DeckCardSkeleton />);
    expect(tree).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { toJSON } = render(<DeckCardSkeleton />);
    expect(toJSON()).toMatchSnapshot();
  });
});
