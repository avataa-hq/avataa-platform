import { IRow } from '../ui/dashboard/kpiSettingsModal/events/EventsRow';

export const createEmptyRow = (): IRow => ({
  columnName: '',
  data: {
    name: '',
    weight: '',
    relaxation_period: '',
    relaxation_function: '',
    aggregation: '',
    min: '',
    max: '',
    decimals: '',
    direction: '',
    goal: '',
    group: '',
    description: '',
    unit: '',
    tics: '',
  },
});
