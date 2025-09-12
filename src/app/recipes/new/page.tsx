"use client";

import { useState } from "react";
import { RecipeDescriptionStep } from "../../../components/recipes/new/recipe-description-step";
import { RecipeIngredientsStep } from "../../../components/recipes/new/recipe-ingredients-step";
import { RecipeNameStep } from "../../../components/recipes/new/recipe-name-step";
import { Button } from "../../../components/ui/button";

export default function NewRecipePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(
    steps[0].index
  );

  const currentStep = steps[currentStepIndex];

  const incrementStepIndex = () => {
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const decrementStepIndex = () => {
    setCurrentStepIndex(currentStepIndex - 1);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      {currentStep.component}
      <div className="flex gap-4">
        {/* Previous Button */}
        <Button onClick={decrementStepIndex} disabled={currentStepIndex === 0}>
          prev
        </Button>
        {/* Next Button */}
        <Button
          onClick={incrementStepIndex}
          disabled={currentStepIndex === steps.length - 1}
        >
          next
        </Button>
      </div>
    </div>
  );
}

type Step = {
  label: string;
  index: number;
  component: React.ReactNode;
};

const steps: Step[] = [
  {
    index: 0,
    label: "Recipe Details",
    component: <RecipeNameStep />,
  },
  {
    index: 1,
    label: "Recipe Description",
    component: <RecipeDescriptionStep />,
  },
  {
    index: 2,
    label: "Recipe Ingredients",
    component: <RecipeIngredientsStep />,
  },
];
