import { Modal, ModulesData, useTranslate } from '6_shared';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useState, useEffect } from 'react';

interface Iprops {
  isModalFilterByDomainOpen: boolean;
  setIsModalFilterByDomainOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modules: ModulesData | undefined;
  selectedModules: string[];
  setSelectedModules: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ModalFilterByDomain = ({
  isModalFilterByDomainOpen,
  setIsModalFilterByDomainOpen,
  modules,
  selectedModules,
  setSelectedModules,
}: Iprops) => {
  const translate = useTranslate();

  const [tempSelectedModules, setTempSelectedModules] = useState<string[]>(selectedModules);

  useEffect(() => {
    if (!isModalFilterByDomainOpen) {
      setTempSelectedModules(selectedModules);
    }
  }, [isModalFilterByDomainOpen, selectedModules]);

  const onModalClose = () => {
    setIsModalFilterByDomainOpen(false);
  };

  const handleModuleChange = (module: string) => {
    setTempSelectedModules((prevTempSelectedModules) => {
      if (prevTempSelectedModules.includes(module)) {
        return prevTempSelectedModules.filter((m) => m !== module);
      }
      return [...prevTempSelectedModules, module];
    });
  };

  const onSaveClick = () => {
    setSelectedModules(tempSelectedModules);
    onModalClose();
  };

  return (
    <Modal
      title={translate('Filter by domains')}
      width="500px"
      open={isModalFilterByDomainOpen}
      onClose={onModalClose}
      actions={
        <Button variant="contained" onClick={onSaveClick}>
          {translate('Save')}
        </Button>
      }
    >
      <FormGroup>
        {modules &&
          Object.keys(modules).map((moduleKey) => (
            <FormControlLabel
              key={moduleKey}
              control={
                <Checkbox
                  checked={tempSelectedModules.includes(modules[moduleKey])} // Используем временное состояние
                  onChange={() => handleModuleChange(modules[moduleKey])}
                />
              }
              label={modules[moduleKey]}
            />
          ))}
      </FormGroup>
    </Modal>
  );
};
