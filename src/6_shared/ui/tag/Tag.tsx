import { ThemeColors } from '6_shared/types';
import { TagContainer } from './Tag.styled';

interface TagProps {
  label: string;
  color: ThemeColors;
  selected?: boolean;
  clickable?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const Tag = ({
  label,
  color = 'primary',
  selected = false,
  clickable = false,
  onClick,
}: TagProps) => {
  return (
    <TagContainer
      component="span"
      color={color}
      selected={selected}
      clickable={clickable}
      onClick={onClick}
    >
      {label}
    </TagContainer>
  );
};
