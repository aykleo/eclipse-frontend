import { RenderSvg } from "../components/pixel-art/render-svg";

export type ExerciseCategory =
  | ""
  | "ENDURANCE"
  | "MOVEMENT"
  | "PLYOMETRICS"
  | "STRENGTH";

export const categoryIcons = [
  {
    category: "",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-all-open.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-all.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-6"
      />
    ),
  },
  {
    category: "ENDURANCE",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-endurance-open.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-endurance.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-6"
      />
    ),
  },
  {
    category: "MOVEMENT",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-movement-open.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-movement.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-6"
      />
    ),
  },
  {
    category: "PLYOMETRICS",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-plyometrics-open.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-plyometrics.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-6"
      />
    ),
  },
  {
    category: "STRENGTH",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-strength-open.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-strength.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-6"
      />
    ),
  },
];
