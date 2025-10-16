const propertyLabels: Record<string, string> = {
  boroughCode: 'Borough code',
  borough: 'Borough',
  created_at: 'Created at',
  cost: 'Cost',
  CQI: 'CQI', // hexbin
  populationDensity: 'Demographic', // hexbin
  max_ue_thp: 'UE Throughput DL',
  name: 'Name',
  neighborhood: 'Neighborhood',
  projectPriority: 'Project Priority', // hexbin
  roiPotential: 'Potential Revenue', // hexbin
  roiUsage: 'Revenue', // hexbin
  rollingSales: 'Housing Cost', // hexbin
  subscribers: 'Subscribers', // hexbin
  trafficUsage: 'Traffic DL',
  traffic_usage: 'Traffic DL', // hexbin
  traffic: 'Traffic DL',
  ueThp: 'UE Throughput DL', // hexbin
  updated_at: 'Updated at',
  used_roi: 'Used ROI',
  utilization: 'Utilization',
  utilisation: 'Utilization',
  estate_cost: 'Estate Cost',
  latency: 'Latency',
  speed: 'Speed',
};

export const getPropertyLabel = ({
  key,
  labels,
}: {
  key?: string;
  labels?: { [key: string]: string };
}) => {
  if (!key) return '';
  if (labels?.hasOwnProperty(key)) {
    return labels[key];
  }

  if (propertyLabels.hasOwnProperty(key)) {
    return propertyLabels[key];
  }
  return key;
};
