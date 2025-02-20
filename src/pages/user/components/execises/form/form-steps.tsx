import React, { RefObject, useMemo } from "react";

interface FormStepsProps {
  primaryMuscleGroupId: string | null;
  muscleGroupIds: string[];
  exerciseNameRef: RefObject<string | null | undefined>;
  exerciseDescriptionRef: RefObject<string | null | undefined>;
  exerciseTagNameRef: RefObject<string | null | undefined>;
  exerciseTagCategoryRef: RefObject<string | null | undefined>;
  step: boolean;
}

export const FormSteps: React.FC<FormStepsProps> = ({
  exerciseNameRef,
  primaryMuscleGroupId,
  muscleGroupIds,
  exerciseTagNameRef,
  exerciseTagCategoryRef,
  exerciseDescriptionRef,
  step,
}) => {
  const stepClasses = useMemo(
    () => ({
      step1:
        exerciseNameRef.current && exerciseNameRef.current?.length > 5
          ? "step-error"
          : "",
      step2: primaryMuscleGroupId ? "step-error" : "",
      step3: muscleGroupIds && muscleGroupIds.length > 1 ? "step-error" : "",
      step4:
        exerciseTagNameRef.current && exerciseTagNameRef.current?.length > 3
          ? "step-error"
          : "",
      step5:
        exerciseTagCategoryRef.current &&
        exerciseTagCategoryRef.current?.length > 3
          ? "step-error"
          : "",
      step6:
        exerciseDescriptionRef.current &&
        exerciseDescriptionRef.current?.length > 5
          ? "step-error"
          : "",
    }),
    // eslint-disable-next-line
    [
      exerciseNameRef,
      primaryMuscleGroupId,
      muscleGroupIds,
      exerciseTagNameRef,
      exerciseTagCategoryRef,
      exerciseDescriptionRef,
      step,
    ]
  );

  return (
    <ul className="steps h-14 w-full">
      <li className={`${stepClasses.step1} text-xl step`} data-content="1"></li>
      <li className={`${stepClasses.step2} text-xl step`}></li>
      <li className={`${stepClasses.step3} text-xl step`}></li>
      <li className={`${stepClasses.step4} text-xl step`}></li>
      <li className={`${stepClasses.step5} text-xl step`} data-content="5"></li>
      <li className={`${stepClasses.step6} text-xl step`}></li>
    </ul>
  );
};
