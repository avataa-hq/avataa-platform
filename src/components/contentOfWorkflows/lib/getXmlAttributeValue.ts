export const getXmlAttributeValue = ({
  xml,
  attributeName,
  tagName,
}: {
  xml: string;
  tagName: string;
  attributeName: string;
}) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    console.error('Failed to parse xml');
    return null;
  }

  const elements = xmlDoc.getElementsByTagName(tagName);
  if (elements.length < 1) {
    console.error(`Failed to find the element with tag name ${tagName} `);
    return null;
  }

  const parentNode = elements[elements.length - 1];

  return parentNode.getAttribute(attributeName);
};
