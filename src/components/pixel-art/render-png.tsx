interface RenderPngProps {
  src: string;
  alt: string;
  className: string;
  imgClassName?: string;
  key?: string | number;
  onClick?: () => void;
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}

export const RenderPng = ({
  src,
  alt,
  className,
  imgClassName,
  key,
  onClick,
  children,
  ref,
}: RenderPngProps) => {
  return (
    <div key={key} onClick={onClick} className={className} ref={ref}>
      <img src={src} alt={alt} className={imgClassName} />
      {children}
    </div>
  );
};
