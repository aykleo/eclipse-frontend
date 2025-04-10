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
        src={`buttons/btn-selected.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-[32px] w-[112px] text-sm text-[#8b7563] px-2 py-[2px]"
      >
        <div className="flex items-center justify-center h-full w-full bg-[#252223]/20">
          Exercises
        </div>
      </RenderSvg>
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-all.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-8"
      />
    ),
  },
  {
    category: "ENDURANCE",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-selected.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-[32px] w-[112px] text-sm text-[#8b7563] px-2 py-[2px]"
      >
        <div className="flex items-center justify-center h-full w-full bg-[#252223]/20">
          Endurance
        </div>
      </RenderSvg>
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-endurance.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-8"
      />
    ),
  },
  {
    category: "MOVEMENT",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-selected.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-[32px] w-[112px] text-sm text-[#8b7563] px-2 py-[2px]"
      >
        <div className="flex items-center justify-center h-full w-full bg-[#252223]/20">
          Movement
        </div>
      </RenderSvg>
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-movement.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-8"
      />
    ),
  },
  {
    category: "PLYOMETRICS",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-selected.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-[32px] w-[112px] text-sm text-[#8b7563] px-2 py-[2px]"
      >
        <div className="flex items-center justify-center h-full w-full bg-[#252223]/20">
          Plyometrics
        </div>
      </RenderSvg>
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-plyometrics.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-8"
      />
    ),
  },
  {
    category: "STRENGTH",
    openIcon: (
      <RenderSvg
        src={`buttons/btn-selected.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="h-[32px] w-[112px] text-sm text-[#8b7563] px-2 py-[2px]"
      >
        <div className="flex items-center justify-center h-full w-full bg-[#252223]/20">
          Strength
        </div>
      </RenderSvg>
    ),
    icon: (
      <RenderSvg
        src={`buttons/btn-strength.svg`}
        size="auto"
        repeat="no-repeat"
        position="center"
        className="size-8"
      />
    ),
  },
];
