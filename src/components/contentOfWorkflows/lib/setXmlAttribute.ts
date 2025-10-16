/**
 * Finds last `XML` element with specified `tagName` and sets new `value` for selected `attribute`. Returns modified `XML` as string.
 *
 */
export const setXmlAttribute = ({
  xml,
  attributeName,
  tagName,
  value,
}: {
  xml: string;
  tagName: string;
  attributeName: string;
  value: string;
}) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    console.error('Failed to parse xml, returned the original xml string');
    return xml;
  }

  const elements = xmlDoc.getElementsByTagName(tagName);
  if (elements.length < 1) {
    console.error(
      `Failed to find the element with tag name ${tagName} , returned the original xml string`,
    );
    return xml;
  }

  const parentNode = elements[elements.length - 1];
  parentNode.setAttribute(attributeName, value);

  const serializer = new XMLSerializer();
  const xmlNewStr = serializer.serializeToString(xmlDoc);

  return xmlNewStr;
};
