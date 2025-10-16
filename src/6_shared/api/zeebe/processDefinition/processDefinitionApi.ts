import { zeebeApi, zeebeApiOptions } from '../zeebeApi';
import {
  IFlowNodeInstanceSearchResponse,
  IGetFlownodeInstanceBody,
  IGetProcessDefinitionBody,
  IGetProcessDefinitionModel,
  IProcessDefinition,
} from './types';

export const processDefinitionApi = zeebeApi.injectEndpoints({
  endpoints: (build) => ({
    getProcessDefinition: build.query<
      IGetProcessDefinitionModel,
      IGetProcessDefinitionBody<IProcessDefinition> | void
    >({
      query: (body) => ({
        url: 'process_definition/get_process_definitions',
        method: 'POST',
        body,
      }),
      providesTags: ['ProcessDefinition'],
      extraOptions: zeebeApiOptions,
    }),
    getProcessDefinitionsXml: build.query<string, number>({
      query: (key) => ({
        url: `process_definition/get_process_definitions_xml/${key}`,
        responseHandler: (response) => response.text(),
      }),
      extraOptions: zeebeApiOptions,
    }),
    getFlownodeInstance: build.mutation<IFlowNodeInstanceSearchResponse, IGetFlownodeInstanceBody>({
      query: (body) => ({
        url: 'flownode_instance/get_flownode_instances',
        method: 'POST',
        body,
      }),
      extraOptions: zeebeApiOptions,
    }),
  }),
});
