export const hasLatLng = (obj: Record<string, any>) => obj.latitude && obj.longitude;

export const filtredByCoord = (hierarchyChildren: any[]) => {
  const a: any[] = [];

  a.push(...hierarchyChildren.filter(hasLatLng));

  hierarchyChildren.forEach((item) => {
    if (item.child) {
      filtredByCoord(item.child);
      a.push(...item.child);
    }
  });

  return a;
};
