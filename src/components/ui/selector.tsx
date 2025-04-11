import { RenderSvg } from "../pixel-art/render-svg";

interface SelectorProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
}

export const Selector = ({ children, className, role }: SelectorProps) => {
  return (
    <div role={role} className={className}>
      <RenderSvg
        src="dividers/divide-1-t.svg"
        size="auto"
        repeat="repeat"
        position="center"
        className="absolute top-[-8px] left-1/2 translate-x-[-50%] w-40 h-4 bg-gradient-to-r from-transparent via-light-bronze to-transparent"
      />

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-light-bronze to-transparent" />
      <RenderSvg
        src="dividers/divide-1-b.svg"
        size="auto"
        repeat="repeat"
        position="center"
        className="absolute bottom-[-8px] left-1/2 translate-x-[-50%] w-40 h-4 bg-gradient-to-r from-transparent via-light-bronze to-transparent"
      />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-light-bronze to-transparent" />
      {children}
    </div>
  );
};
