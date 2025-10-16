import { useCallback, useState } from 'react';
import { IObjectComponentParams, useObjectCRUD } from '6_shared';
import {
  BooleanComponent,
  DateComponent,
  DateTimeComponent,
  LinkToObjectComponent,
  LinkToParameterComponent,
  MultipleComponent,
  MultipleModal,
  StringComponent,
  LinkToUserComponent,
  EnumComponent,
  EnumMultipleComponent,
  LinkToParameterMultipleComponent,
  LinkToUserMultipleComponent,
  LinkToObjectMultipleComponent,
} from './objectParametersInputComponents';
import * as SC from './ObjectParametersInput.styled';

interface IProps {
  param: IObjectComponentParams;
  handleParamsLoading: (loading: boolean) => void;
}

export const ObjectParametersInput = ({ param, handleParamsLoading }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { objectCRUDComponentUi, duplicateObject } = useObjectCRUD();
  const { objectCRUDComponentMode } = objectCRUDComponentUi;

  const onEditClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <SC.ObjectParametersInputStyled>
      {!param.multiple && (
        <>
          {['str', 'int', 'float', 'formula', 'sequence'].includes(param.val_type) && (
            <StringComponent param={param} />
          )}
          {param.val_type === 'bool' && <BooleanComponent param={param} />}
          {param.val_type === 'date' && <DateComponent param={param} />}
          {param.val_type === 'datetime' && <DateTimeComponent param={param} />}
          {['mo_link', 'two-way link'].includes(param.val_type) && (
            <LinkToObjectComponent
              param={param}
              duplicateObject={duplicateObject}
              objectCRUDComponentMode={objectCRUDComponentMode}
            />
          )}
          {param.val_type === 'prm_link' && (
            <LinkToParameterComponent
              param={param}
              duplicateObject={duplicateObject}
              objectCRUDComponentMode={objectCRUDComponentMode}
            />
          )}
          {param.val_type === 'user_link' && <LinkToUserComponent param={param} />}
          {param.val_type === 'enum' && (
            <EnumComponent param={param} duplicateObject={duplicateObject} />
          )}
        </>
      )}

      {param.multiple && !['enum', 'prm_link', 'user_link', 'mo_link'].includes(param.val_type) && (
        <MultipleComponent
          param={param}
          onEditClick={onEditClick}
          handleParamsLoading={handleParamsLoading}
          duplicateObject={duplicateObject}
        />
      )}

      {param.multiple && (
        <>
          {param.val_type === 'mo_link' && (
            <LinkToObjectMultipleComponent param={param} duplicateObject={duplicateObject} />
          )}

          {param.val_type === 'prm_link' && <LinkToParameterMultipleComponent param={param} />}

          {param.val_type === 'enum' && (
            <EnumMultipleComponent param={param} duplicateObject={duplicateObject} />
          )}

          {param.val_type === 'user_link' && <LinkToUserMultipleComponent param={param} />}

          <MultipleModal
            isModalOpen={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            param={param}
          />
        </>
      )}
    </SC.ObjectParametersInputStyled>
  );
};
