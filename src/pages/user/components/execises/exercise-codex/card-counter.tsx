import { TemplateExercise } from "../../../../../utils/types/exercise-types";
import { RenderPixelArt } from "../../../../../components/pixel-art/render-pixel-art";

interface CardCounterProps {
  isCreatingTemplate: boolean;
  setIsCreatingTemplate: (isCreatingTemplate: boolean) => void;
  templateExercises: TemplateExercise[];
}

export const CardCounter = ({
  isCreatingTemplate,
  setIsCreatingTemplate,
  templateExercises,
}: CardCounterProps) => {
  return (
    <RenderPixelArt
      src="url(src/assets/pixel-art/card-counter.svg)"
      size={`${isCreatingTemplate ? "96px" : "48px"}`}
      repeat="no-repeat"
      position="center"
      className={`${
        isCreatingTemplate ? "size-24" : "size-12"
      } cursor-pointer flex items-center justify-center flex-col relative`}
    >
      <button
        onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
        className={`size-8/10 rounded-lg cursor-pointer flex items-center justify-center`}
      >
        <div className={`mt-5.5 text-xs `}>
          {templateExercises.length > 0
            ? templateExercises.length
            : isCreatingTemplate
            ? "0"
            : ""}
        </div>
      </button>
    </RenderPixelArt>
  );
};
