import { Box } from '6_shared';
import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const DiagramContainer = styled(Box)`
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .bjs-powered-by {
    display: none;
  }

  .djs-popup-backdrop {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  /* .djs-popup.color-picker {
    position: absolute;
  } */

  .djs-popup.bpmn-replace {
    position: fixed;
  }

  .bpmn-properties-panel-parent {
    border: none;
  }
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${({ theme }) => theme.palette.background.paper};
  z-index: 2;
`;

export const EditorContainer = styled(Box)`
  label: WorkFlowContentContainer;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: black;

  .djs-container > svg {
    background: white;
    background-image: radial-gradient(black 1px, transparent 0);
    background-size: 20px 20px;
  }
`;

export const PropertiesPanelButton = styled(Button)`
  label: PropertiesPanelButton;
  position: absolute;
  right: 0;
  top: 50%;
  z-index: 1;
  transform: translate(50%, -50%) rotate(-90deg);
  transform-origin: bottom;
  gap: 5px;
  border-radius: 5px 5px 0 0;
  background-color: white;
  border-width: 1px 1px 0 1px;
  border-color: #b9bcc6;
  border-style: solid;
  padding: 5px 15px;

  &:hover {
    transform: translate(50%, -50%) rotate(-90deg);
    background-color: white;
  }
`;

export const PropertiesPanel = styled(Box)`
  label: PropertiesPanel;

  max-width: 0px;
  box-sizing: border-box;
  transition: max-width 0.3s ease-out;
  background-color: white;
  border-left: 1px solid #b9bcc6;

  &.open {
    max-width: 400px;
  }
`;
