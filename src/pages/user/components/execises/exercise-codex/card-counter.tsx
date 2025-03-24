import { TemplateExercise } from "../../../../../utils/types/exercise-types";
import { RenderSvg } from "../../../../../components/pixel-art/render-svg";

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
  const getImageSrc = (length: number) => {
    if (length > 5) {
      return "url(src/assets/pixel-art/card-counter/card-counter-3.svg)";
    } else if (length >= 3) {
      return "url(src/assets/pixel-art/card-counter/card-counter-2.svg)";
    } else if (length > 0) {
      return "url(src/assets/pixel-art/card-counter/card-counter-1.svg)";
    } else {
      return "url(src/assets/pixel-art/card-counter/card-counter.svg)";
    }
  };

  return (
    <RenderSvg
      src={getImageSrc(templateExercises.length)}
      size={`${isCreatingTemplate ? "96px" : "48px"}`}
      repeat="no-repeat"
      position="center"
      className={`${
        isCreatingTemplate ? "size-24" : "size-12"
      }  cursor-pointer transition-all duration-300 flex items-center justify-center flex-col relative`}
    >
      <button
        onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
        className={`size-8/10 relative rounded-lg cursor-pointer flex items-center justify-center`}
      >
        <RenderSvg
          src="url(src/assets/pixel-art/portrait-32.svg)"
          size="auto"
          repeat="no-repeat"
          position="center"
          className={`${
            !isCreatingTemplate ? "hidden" : ""
          } text-lg absolute -top-9 right-0 size-8 text-center flex items-center justify-center`}
        >
          {templateExercises.length > 0
            ? templateExercises.length
            : isCreatingTemplate
            ? "0"
            : ""}
        </RenderSvg>
      </button>
    </RenderSvg>
  );
};
