export function getGradient(ctx: any, chartArea: any, gradientColors: string[]) {
  let width: any;
  let height: any;
  let gradient: any;

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

    const gradientStep = 1 / gradientColors.length;

    gradientColors.forEach((color, i) => {
      gradient.addColorStop(i * gradientStep, color);
    });
  }

  return gradient;
}
