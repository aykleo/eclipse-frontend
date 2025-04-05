interface RenderPngProps {
  src: string;
  alt: string;
  className: string;
  imgClassName?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  ref?:
    | React.RefObject<HTMLDivElement>
    | ((element: HTMLDivElement | null) => void);
  style?: React.CSSProperties;
}

export const RenderPng = ({
  src,
  alt,
  className,
  imgClassName,
  onClick,
  children,
  ref,
  style,
}: RenderPngProps) => {
  return (
    <div onClick={onClick} className={className} ref={ref} style={style}>
      <img
        src={`/src/assets/pixel-art/${src}`}
        alt={alt}
        className={imgClassName}
      />
      {children}
    </div>
  );
};
