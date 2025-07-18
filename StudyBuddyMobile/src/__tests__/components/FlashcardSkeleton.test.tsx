import React from "react";
import { render } from "../../testUtils/testUtils";
import FlashcardSkeleton from "../../components/FlashcardSkeleton";

describe("FlashcardSkeleton", () => {
  it("should render without crashing", () => {
    const { toJSON } = render(<FlashcardSkeleton />);
    expect(toJSON()).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { toJSON } = render(<FlashcardSkeleton />);
    expect(toJSON()).toMatchSnapshot();
  });
});
