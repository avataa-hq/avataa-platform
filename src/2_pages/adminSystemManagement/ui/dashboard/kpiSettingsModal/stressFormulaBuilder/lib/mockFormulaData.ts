export const sqlQuery = `
ROUND(
  SUM(
    CASE
      WHEN dateDiff('day', f.event_date, all_days) BETWEEN 0 AND e.relaxation_days - 1 THEN
        e.weight * f.count_e * 
        POW(
          (1 - dateDiff('day', f.event_date, all_days) / e.relaxation_days),
          (e.alpha / e.beta)
        )
      ELSE
        0
    END
  ),
  2
) AS daily_stress
`;
