let currentRanges: { start: string; end: string }[] = [];

export const setHighlightRange = (ranges: { start: string; end: string }[] | null) => {
  currentRanges = ranges ?? [];
};

export const rangeHighlightPlugin = {
  id: 'rangeHighlight',
  beforeDraw: (chart: any) => {
    const { ctx } = chart;
    ctx.clearRect(0, 0, chart.width, chart.height);

    if (!currentRanges || currentRanges.length === 0) return;

    const xAxis = chart.scales.x;

    ctx.save();
    ctx.fillStyle = 'rgba(255,99,132,0.1)';

    currentRanges.forEach((range) => {
      const startX = xAxis?.getPixelForValue(new Date(range.start));
      const endX = xAxis?.getPixelForValue(new Date(range.end));

      ctx.fillRect(
        startX,
        chart.chartArea.top,
        endX - startX,
        chart.chartArea.bottom - chart.chartArea.top,
      );
    });

    ctx.restore();
  },
};
