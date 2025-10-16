export const isResponseVersionConflict = (res: any) => {
  return (
    (res &&
      typeof res === 'object' &&
      res.hasOwnProperty('status') &&
      res.status === 422 &&
      res.data &&
      res.data.detail &&
      res.data.detail.includes('version')) ||
    false
  );
};
