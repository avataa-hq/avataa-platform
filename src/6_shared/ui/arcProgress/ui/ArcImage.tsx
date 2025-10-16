interface IProps {
  imageUrl: string;
}

export const ArcImage = ({ imageUrl }: IProps) => {
  return (
    <>
      <defs>
        <clipPath id="arc-clip">
          <circle cx="50" cy="50" r="38" />
        </clipPath>
      </defs>

      <image
        width="80"
        height="80"
        preserveAspectRatio="xMidYMid slice"
        x={10}
        y={10}
        href={imageUrl}
        clipPath="url(#arc-clip)"
      />
    </>
  );
};
