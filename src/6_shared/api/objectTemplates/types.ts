export interface IObjectTemplateParameterModel {
  id: number;
  parameter_type_id: number;
  value: string;
  constraint: string;
  required: boolean;
  val_type: string;
  valid: boolean;
}

export interface IObjectTemplateObjectModel {
  id: number;
  object_type_id: number;
  required: boolean;
  parameters: IObjectTemplateParameterModel[];
  children: IObjectTemplateObjectModel[];
  valid: boolean;
}

export type ICreateObjectTemplateParametersBody = Omit<
  IObjectTemplateParameterModel,
  'id' | 'valid' | 'val_type' | 'constraint'
> &
  Partial<Pick<IObjectTemplateParameterModel, 'constraint'>>;

export interface ICreateObjectTemplateBody {
  name: string;
  owner: string;
  object_type_id: number;
  template_objects: (Omit<
    IObjectTemplateObjectModel,
    'id' | 'children' | 'valid' | 'parameters'
  > & {
    parameters: ICreateObjectTemplateParametersBody[];
  })[];
}

type AddTemplateObjectBody = Omit<
  IObjectTemplateObjectModel,
  'id' | 'children' | 'valid' | 'parameters'
> & {
  parameters: ICreateObjectTemplateParametersBody[];
};

export interface IAddTemplateObjectsBody {
  template_id: number;
  parent_id?: number;
  body: AddTemplateObjectBody[];
}

export interface IAddTemplateParametersBody {
  template_object_id: number;
  body: ICreateObjectTemplateParametersBody[];
}

export interface IObjectTemplateBody {
  limit?: number;
  offset?: number;
}

export interface IObjectTemplateModel {
  id: number;
  name: string;
  owner: string;
  object_type_id: number;
  // template_objects: IObjectTemplateObjectModel[];
  valid: boolean;
}

export interface IUpdateObjectTemplateBody {
  template_id: number;
  name: string;
  owner: string;
  object_type_id: number;
}

export interface IGetTemplateObjectsBody {
  template_id: number;
  parent_id?: number;
  depth: number;
  include_parameters: boolean;
}

export interface IGetTemplateObjectBody {
  id: number;
  include_parameters: boolean;
}

export interface IUpdateTemplateObjectBody {
  object_id: number;
  required: boolean;
  parent_object_id: number;
}

export interface IUpdateObjectTemplateParameterBody {
  parameter_id: number;
  parameter_type_id: number;
  value?: string;
  constraint?: string;
  required?: boolean;
}

export interface IUpdateObjectTemplateParameter
  extends Omit<IUpdateObjectTemplateParameterBody, 'parameter_id'> {
  id: number;
}

export interface IUpdateObjectTemplateParametersBody {
  template_object_id: number;
  parameters: IUpdateObjectTemplateParameter[];
}

export interface IGetTemplatesByFilterBody {
  name?: string;
  owner?: string;
  object_type_id?: number;
  limit?: number;
  offset?: number;
}

export interface IGetTemplatesByFilterModel extends IObjectTemplateModel {
  creation_date: Date;
  modification_date: Date;
  version: number;
}

export interface IGetTemplatesByFilterResponse {
  data: IGetTemplatesByFilterModel[];
}

export interface INotValidParamWithObjectType {
  param: IObjectTemplateParameterModel;
  objectTypeName: string;
  objectTypeId: number;
}

export interface IGetTemplateObjectsByObjectTypeIdModel
  extends Omit<IObjectTemplateObjectModel, 'children'> {
  template_id: number;
}

export interface IExportTemplateBody {
  template_ids: number[];
}
