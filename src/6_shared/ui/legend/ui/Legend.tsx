import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Typography, useTheme } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import { Remove } from '@mui/icons-material';
import { dotWave } from 'ldrs';
import { Button, useTranslate } from '6_shared';

import { LegendProps } from '../model/types';
import {
  Backdrop,
  LegendBody,
  LegendHeader,
  LegendContainer,
  LoadingContainer,
} from './Legend.styled';
import { LegendItem } from './LegendItem';

dotWave.register();

export const Legend = ({
  data,
  isLoading,
  getItemIcon,
  isInitiallyOpen = false,
  title = 'Legend',
  sx,
  styles,
  handleCheckboxClick,
}: LegendProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  return (
    <Backdrop>
      <Draggable
        bounds="parent"
        axis={isOpen ? 'both' : 'none'}
        handle=".handle"
        position={isOpen ? undefined : { x: 0, y: 0 }}
        nodeRef={containerRef}
      >
        <LegendContainer
          ref={containerRef}
          isOpen={isOpen}
          className="handle"
          sx={sx}
          style={styles}
        >
          {isLoading && isOpen && (
            <LoadingContainer>
              <l-dot-wave size="47" speed="1" color={theme.palette.primary.main} />
            </LoadingContainer>
          )}
          <LegendHeader>
            {isOpen && title && (
              <Typography>{title === 'Legend' ? translate(title) : title}</Typography>
            )}
            <Button onClick={() => setIsOpen((prev) => !prev)}>
              {isOpen ? <Remove /> : <ListIcon color={isOpen ? 'primary' : 'secondary'} />}
            </Button>
          </LegendHeader>
          {isOpen && (
            <LegendBody>
              {data.length === 0 && (
                <Typography>{translate('There are no legend items')}</Typography>
              )}
              {data.length > 0 &&
                data.map((item) => (
                  <LegendItem
                    key={item.id}
                    item={item}
                    getItemIcon={getItemIcon}
                    handleCheckboxClick={handleCheckboxClick}
                  />
                ))}
            </LegendBody>
          )}
        </LegendContainer>
      </Draggable>
    </Backdrop>
  );
};
