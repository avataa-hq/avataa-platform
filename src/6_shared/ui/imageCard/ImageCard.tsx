import { Box, Typography } from '@mui/material';

import { MouseEventHandler } from 'react';
import { useTranslate } from '6_shared';
import { CardImage, ImageCardContainer } from './ImageCard.styled';

interface ScenarioCardProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  index?: number;
  title: string;
  description?: string;
  imageUrl?: string;
}

export const ImageCard = ({
  title,
  description,
  imageUrl,
  onClick,
  index = 0,
}: ScenarioCardProps) => {
  const translate = useTranslate();

  return (
    <ImageCardContainer onClick={onClick} component="div" className="card" index={index}>
      <Box component="div" sx={{ flex: 1, minHeight: 0 }}>
        <CardImage
          alt=""
          src={imageUrl ?? '/icons/modules/inventory_module.svg'}
          className="card__icon"
        />
      </Box>
      <Box component="div" className="card__text-container">
        <Typography variant="h1" sx={{ marginBottom: '1.25rem' }}>
          {translate(title as any)}
        </Typography>
        {description && (
          <Typography variant="h3" className="card__text">
            {translate(description as any)}
          </Typography>
        )}
      </Box>
    </ImageCardContainer>
  );
};
