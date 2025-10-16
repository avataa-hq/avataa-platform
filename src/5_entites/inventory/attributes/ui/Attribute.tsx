import { INewObjectParams } from '5_entites';
import { DefaultAttribute } from './DefaultAttribute';
import { ObjectLinkAttribute } from './ObjectLinkAttribute';

interface AttributeProps {
  param: INewObjectParams['params'][number];
}

export const Attribute = ({ param }: AttributeProps) => {
  switch (param.val_type) {
    case 'mo_link':
      return <ObjectLinkAttribute param={param} />;
    default:
      return <DefaultAttribute param={param} />;
  }
};
