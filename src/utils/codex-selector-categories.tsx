import { RenderPixelArt } from "../components/pixel-art/render-pixel-art";

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
      <RenderPixelArt
        src={`url(src/assets/pixel-art/buttons/btn-all-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderPixelArt
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
      <RenderPixelArt
        src={`url(src/assets/pixel-art/buttons/btn-endurance-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderPixelArt
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
      <RenderPixelArt
        src={`url(src/assets/pixel-art/buttons/btn-movement-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderPixelArt
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
      <RenderPixelArt
        src={`url(src/assets/pixel-art/buttons/btn-plyometrics-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderPixelArt
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
      <RenderPixelArt
        src={`url(src/assets/pixel-art/buttons/btn-strength-open.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-6 w-24"
      />
    ),
    icon: (
      <RenderPixelArt
        src={`url(src/assets/pixel-art/buttons/btn-strength-24.svg)`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-6"
      />
    ),
  },
];
