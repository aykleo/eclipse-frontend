import {
  Exercise,
  TemplateExercise,
} from "../../../../../utils/types/exercise-types";
import { RenderPixelArt } from "../../../../../components/pixel-art/render-pixel-art";

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseForUpdate?: Exercise | null;
  setExerciseForUpdate?: (exercise: Exercise | null) => void;
  setSearchParams?: (
    params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace: boolean }
  ) => void;
  isCreatingTemplate?: boolean;
  templateExercises?: TemplateExercise[];
  setTemplateExercises?: (exercises: TemplateExercise[]) => void;
}

export const ExerciseCard = ({
  exercise,
  exerciseForUpdate,
  setExerciseForUpdate,
  setSearchParams,
  isCreatingTemplate,
  templateExercises,
  setTemplateExercises,
}: ExerciseCardProps) => {
  const handleAddExerciseToTemplate = () => {
    if (isCreatingTemplate && setTemplateExercises && templateExercises) {
      const isExerciseAlreadyAdded = templateExercises.some(
        (templateExercise) => templateExercise.exerciseId === exercise.id
      );

      if (!isExerciseAlreadyAdded) {
        setTemplateExercises([
          ...templateExercises,
          { exerciseId: exercise.id, notes: "", name: exercise.name },
        ]);
      }
    }
  };
  return (
    <>
      <RenderPixelArt
        key={exercise.id}
        onClick={handleAddExerciseToTemplate}
        src={
          "url(src/assets/pixel-art/exercise-cards/generic-exercise-card.svg)"
        }
        size="auto"
        repeat="no-repeat"
        position="center"
        className={`${
          !isCreatingTemplate
            ? "cursor-default"
            : "cursor-pointer hover:scale-105 transition-all duration-300"
        } flex-col w-[192px] h-[256px] flex items-center justify-center rounded-md flex-grow-0 flex-shrink-0 transition-all duration-300 relative`}
      >
        {/* <div
          className={`${
            exercise.exerciseMuscleGroups.length < 2
              ? "hidden"
              : "absolute left-1 -top-5 flex flex-row gap-x-0.5"
          }`}
        >
          {exercise.exerciseMuscleGroups
            .filter((muscleGroup) => !muscleGroup.isPrimary)
            .map((muscleGroup) => (
              <div
                key={muscleGroup.muscleGroup.name}
                className={`${getColorBackgroundForTagCategory(
                  exercise.tag.category
                )} rounded-md rounded-b-none p-[1.5px] tooltip tooltip-bottom cursor-help`}
                data-tip={muscleGroup.muscleGroup.name.replace(/_/g, " ")}
              >
                <img
                  src={`src/assets/icons/muscle-group/${muscleGroup.muscleGroup.name}.png`}
                  alt={`${muscleGroup.muscleGroup.name} icon`}
                  className={`size-5  rounded-md rounded-b-none`}
                />
              </div>
            ))}
        </div> */}

        <div className="flex w-full items-center absolute top-6 justify-center pt-3">
          {exercise.exerciseMuscleGroups
            .filter((muscleGroup) => muscleGroup.isPrimary)
            .map((muscleGroup) => (
              <img
                key={muscleGroup.muscleGroup.name}
                src={`src/assets/pixel-art/muscles/${muscleGroup.muscleGroup.name}.svg`}
                alt={`${muscleGroup.muscleGroup.name} icon`}
                className="size-16"
              />
            ))}
        </div>

        <span className="w-[170px] h-[32px] justify-center px-2.5 absolute top-31.5">
          <div className="size-full pt-1.5 truncate text-center">
            {exercise.name ? <>{exercise.name}</> : "No name"}
          </div>
        </span>

        {exercise.tag.category && (
          <RenderPixelArt
            src={`url(src/assets/pixel-art/exercise-cards/category-indicator-${exercise.tag.category}.svg)`}
            position="center"
            size="auto"
            repeat="no-repeat"
            className={` size-7 rounded-lg p-1 absolute top-28`}
          />
        )}

        {/* <span className={`w-full px-1`}>
              <div
                className={`${
                  exercise.tag.category
                    ? getColorBackgroundForTagCategory(exercise.tag.category)
                    : "bg-neutral-700"
                } w-full truncate text-center px-3 text-xs lg:text-sm`}
                style={{
                  clipPath:
                    "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
                }}
              >
                {exercise.tag.name ? exercise.tag.name : "No tag"}
              </div>
            </span> */}
        <div className="h-[72px] text-xs p-1 absolute w-[156px] break-words bottom-4 overflow-y-auto no-scrollbar">
          {exercise.description
            ? exercise.description
            : "There is no description"}
        </div>
        {setSearchParams && exercise.id !== exerciseForUpdate?.id && (
          <button
            className={`cursor-pointer absolute left-[47px] top-[5px] size-6 rounded-full ${
              isCreatingTemplate && "bg-neutral-800/50"
            }`}
            disabled={
              exercise.id === exerciseForUpdate?.id || isCreatingTemplate
            }
            onClick={async () => {
              setSearchParams(
                (prev) => {
                  prev.set("exerciseToDeleteId", exercise.id);
                  prev.set("exerciseToDeleteName", exercise.name);
                  return prev;
                },
                { replace: true }
              );
              const modal = document.getElementById(
                "delete_exercise_modal"
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
          />
        )}
        <button
          className={`cursor-pointer absolute top-[5px] size-6 rounded-full ${
            isCreatingTemplate && "bg-neutral-800/50"
          }`}
          disabled={exercise.id === exerciseForUpdate?.id || isCreatingTemplate}
        />
        {setExerciseForUpdate && (
          <button
            className={`cursor-pointer absolute right-[47px] top-[5px] size-6 rounded-full ${
              isCreatingTemplate && "bg-neutral-800/50"
            }`}
            disabled={
              exercise.id === exerciseForUpdate?.id || isCreatingTemplate
            }
            onClick={() => {
              setExerciseForUpdate(exercise);

              if (exercise.id === exerciseForUpdate?.id) {
                setExerciseForUpdate(null);
              }
            }}
          />
        )}
      </RenderPixelArt>
    </>
  );
};
