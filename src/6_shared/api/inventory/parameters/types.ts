export interface InventoryParameterModel {
  id: number;
  version: number;
  tprm_id: number;
  mo_id: number;
  value: number | number[];
}
export interface InventoryObjectOutInLinkModel {
  id: number;
  version: number;
  tprm_id: number;
  mo_id: number;
  value: number[];
}
export interface InventoryObjectLinkModel {
  in_links: InventoryObjectOutInLinkModel[];
  out_links: InventoryObjectOutInLinkModel[];
}

export interface GetObjectParamsRequest {
  object_id: number;
  tprm_id?: number[];
}

export interface GetParameterRequestParams {
  object_id: number;
  param_type_id: number;
}

export interface DeleteParameterRequestParams extends GetParameterRequestParams {}

export interface GetParameterHistoryRequestParams {
  id: number;
  date_from?: Date;
  date_to?: Date;
}

export interface GetParameterValuesBody {
  id: number;
  body: number[];
}

export interface UpdateParameterValuesBody {
  tprm_id: number;
  new_value: any;
  version?: number;
}

export interface MultipleParameterUpdateBody {
  object_id: number;
  new_values: UpdateParameterValuesBody[];
}

export interface MultipleParameterDeleteBody {
  object_id: number;
  tprm_id: number;
}

interface MultipleParamResponse {
  value: string;
  id: number;
  version: number;
  tprm_id: number;
  mo_id: number;
}

export interface MultipleCreateResponse {
  created_params: MultipleParamResponse[];
}

export interface MultipleUpdateResponse {
  updated_params: MultipleParamResponse[];
}

export interface MultipleDeleteResponse {
  deleted_params: [
    {
      id: number;
      version: number;
      tprm_id: number;
      mo_id: number;
      value: string;
    },
  ];
}

interface PrmLinkModelLinkedParameter {
  linked_prm_id: number;
  linked_prm_value: string;
  linked_mo_id: number;
  linked_mo_name: string;
}

export interface GetFullDataAboutPrmLinkModel {
  [key: string]: {
    tprm_id: number;
    id: number;
    mo_id: number;
    value: string;
    version: number;
    linked_parameters: PrmLinkModelLinkedParameter[];
  };
}

interface MoLinkLinkedObject {
  linked_mo_id: number;
  linked_mo_name: string;
}

export interface GetFullDataAboutMoLinkModel {
  [key: string]: {
    tprm_id: number;
    id: number;
    mo_id: number;
    value: string;
    version: number;
    linked_objects: MoLinkLinkedObject[];
  };
}

export interface GetFullDataAboutTwoWayMoLink {
  [key: string]: {
    backward_link: number;
    mo_id: number;
    id: number;
    tprm_id: number;
    value: string;
    version: number;
    linked_object: MoLinkLinkedObject;
  };
}

export interface IGetParameterDataModel {
  mo_id: number;
  prm_id: number;
  mo_name: string;
  value: string;
}
