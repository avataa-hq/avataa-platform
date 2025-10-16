export const formatSummaryText = (input: string): string => {
  try {
    const formattedText = input
      .replace(/\*\*(.*?)\*\*/g, '<span><strong>$1</strong></span>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\* /gm, '• ');

    return formattedText;
  } catch (error) {
    console.error('Error formatting text:', error);
    return input;
  }
};
