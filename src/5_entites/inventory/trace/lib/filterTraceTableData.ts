export const filterTraceTableData = (tableRows: Record<string, any>[], newSearchQuery: string) => {
  return tableRows.filter((row) => {
    return (
      row.tmo_name.toLowerCase().includes(newSearchQuery.trim().toLowerCase()) ||
      row.mo_id.toString().toLowerCase().includes(newSearchQuery.trim().toLowerCase()) ||
      row.mo_name.toLowerCase().includes(newSearchQuery.trim().toLowerCase()) ||
      row.parent_mo_name.toLowerCase().includes(newSearchQuery.trim().toLowerCase()) ||
      row.parent_mo_id.toString().toLowerCase().includes(newSearchQuery.trim().toLowerCase()) ||
      row.latitude.toString().toLowerCase().includes(newSearchQuery.trim().toLowerCase()) ||
      row.longitude.toString().toLowerCase().includes(newSearchQuery.trim().toLowerCase())
    );
  });
};
