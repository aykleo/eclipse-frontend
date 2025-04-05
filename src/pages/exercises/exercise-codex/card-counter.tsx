import { RenderSvg } from "../../../components/pixel-art/render-svg";
import { useExerciseState } from "../../../hooks/exercises/exercise-context";
import { TemplateItem } from "../../../utils/types/template-types";

interface CardCounterProps {
  templateExercises: TemplateItem[];
}

export const CardCounter = ({ templateExercises }: CardCounterProps) => {
  const { isCreatingTemplate, setIsCreatingTemplate } = useExerciseState();

  const getImageSrc = (length: number) => {
    if (length > 5) {
      return "card-counter/card-counter-3.svg";
    } else if (length >= 3) {
      return "card-counter/card-counter-2.svg";
    } else if (length > 0) {
      return "card-counter/card-counter-1.svg";
    } else {
      return "card-counter/card-counter.svg";
    }
  };

  return (
    <RenderSvg
      src={getImageSrc(templateExercises.length)}
      size={`${isCreatingTemplate ? "64px" : "48px"}`}
      repeat="no-repeat"
      position="center"
      className={`${
        isCreatingTemplate
          ? "size-[64px] brightness-125  hover:brightness-100"
          : "size-12 brightness-75  hover:brightness-100"
      }  cursor-pointer transition-all duration-300 flex items-center justify-center flex-col relative filter`}
    >
      <button
        onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
        className={`size-8/10 relative rounded-lg cursor-pointer flex items-center justify-center`}
      >
        <RenderSvg
          src="card-counter/card-counter-counter-32.svg"
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
