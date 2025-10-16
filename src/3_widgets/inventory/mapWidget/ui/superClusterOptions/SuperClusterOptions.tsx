import { Button, Typography, IconButton, Slider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { AnyProps, Options } from 'supercluster';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { Content, Body, Footer, Header, SliderContainer } from './SuperClusterOptions.styled';

const copyObjectToClipboard = <T extends Record<string, any>>(obj: T) => {
  try {
    const jsonString = JSON.stringify(obj, null, 2);

    const textarea = document.createElement('textarea');
    textarea.value = jsonString;

    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, 99999);

    document.execCommand('copy');

    document.body.removeChild(textarea);

    return true;
  } catch (error) {
    console.error('Ошибка при копировании объекта в буфер обмена:', error);
    return false;
  }
};

// Пример использования
const exampleObject = {
  name: 'John Doe',
  age: 30,
  city: 'New York',
};

copyObjectToClipboard(exampleObject);

interface IProps {
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  setOptions?: Dispatch<SetStateAction<Options<AnyProps, AnyProps>>>;
  clusterOptions?: Options<AnyProps, AnyProps>;
}
export const SuperClusterOptions = ({ isOpen, setIsOpen, setOptions, clusterOptions }: IProps) => {
  const [isCopyGood, setIsCopyGood] = useState(false);

  useEffect(() => {
    if (isCopyGood) {
      setTimeout(() => {
        setIsCopyGood(false);
        setIsOpen?.(false);
      }, 500);
    }
  }, [isCopyGood]);
  return (
    <Content>
      <Header>
        <Typography>Cluster Settings</Typography>
        <IconButton onClick={() => setIsOpen?.(false)}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Body>
        <SliderContainer>
          <Typography>Radius</Typography>
          <Slider
            valueLabelDisplay="auto"
            value={clusterOptions?.radius || 1}
            min={1}
            max={200}
            marks={[
              { label: 'min', value: 1 },
              { label: 'max', value: 200 },
            ]}
            onChange={(event, value) => {
              if (typeof value === 'number') {
                setOptions?.((prev) => ({ ...prev, radius: value }));
              }
            }}
          />
        </SliderContainer>
        <SliderContainer>
          <Typography>Max zoom</Typography>
          <Slider
            valueLabelDisplay="auto"
            value={clusterOptions?.maxZoom || 18}
            min={10}
            max={20}
            marks={[
              { label: 'min', value: 10 },
              { label: 'max', value: 20 },
            ]}
            onChange={(event, value) => {
              if (typeof value === 'number') {
                setOptions?.((prev) => ({ ...prev, maxZoom: value }));
              }
            }}
          />
        </SliderContainer>
        <SliderContainer>
          <Typography>Extent</Typography>
          <Slider
            valueLabelDisplay="auto"
            value={clusterOptions?.extent || 422}
            min={150}
            max={512}
            marks={[
              { label: 'min', value: 150 },
              { label: 'max', value: 512 },
            ]}
            onChange={(event, value) => {
              if (typeof value === 'number') {
                setOptions?.((prev) => ({ ...prev, extent: value }));
              }
            }}
          />
        </SliderContainer>
        <SliderContainer>
          <Typography>Node size</Typography>
          <Slider
            valueLabelDisplay="auto"
            value={clusterOptions?.nodeSize || 64}
            min={1}
            max={200}
            marks={[
              { label: 'min', value: 1 },
              { label: 'max', value: 200 },
            ]}
            onChange={(event, value) => {
              if (typeof value === 'number') {
                setOptions?.((prev) => ({ ...prev, nodeSize: value }));
              }
            }}
          />
        </SliderContainer>
      </Body>
      <Footer>
        <Button
          color={isCopyGood ? 'success' : 'primary'}
          onClick={() => {
            if (clusterOptions && !isCopyGood) {
              const goodCopy = copyObjectToClipboard(clusterOptions);
              setIsCopyGood(goodCopy);
            }
          }}
          variant="contained"
        >
          Copy to buffer
          <CopyAllIcon />
        </Button>
      </Footer>
    </Content>
  );
};
