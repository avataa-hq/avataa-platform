import { graphApi as graphApiBase } from './graphApi';
import { analysisApi } from './analysis';
import { buildingApi } from './building';
import { initialisationApi } from './initialisation';
import { tmoApi } from './tmo';
import { traceApi } from './trace';
import { graphSearchApi } from './search';

export const graphApi = {
  ...graphApiBase,
  initialisation: initialisationApi,
  tmo: tmoApi,
  building: buildingApi,
  analysis: analysisApi,
  trace: traceApi,
  search: graphSearchApi,
};

export * from './types';
