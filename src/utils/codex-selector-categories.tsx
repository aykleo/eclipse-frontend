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
        src={`url(src/assets/pixel-art/buttons/btn-all-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`url(src/assets/pixel-art/buttons/btn-all-24.svg)`}
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
        src={`url(src/assets/pixel-art/buttons/btn-endurance-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`url(src/assets/pixel-art/buttons/btn-endurance-24.svg)`}
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
        src={`url(src/assets/pixel-art/buttons/btn-movement-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`url(src/assets/pixel-art/buttons/btn-movement-24.svg)`}
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
        src={`url(src/assets/pixel-art/buttons/btn-plyometrics-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`url(src/assets/pixel-art/buttons/btn-plyometrics-24.svg)`}
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
        src={`url(src/assets/pixel-art/buttons/btn-strength-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderSvg
        src={`url(src/assets/pixel-art/buttons/btn-strength-24.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-6"
      />
    ),
  },
];
