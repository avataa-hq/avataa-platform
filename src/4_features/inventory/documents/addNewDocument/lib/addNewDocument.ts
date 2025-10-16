import { file2Base64, IPostFileBody, fileSizeInMegabyte } from '6_shared';
import config from 'config';
import { KeycloakTokenParsed } from 'keycloak-js';

interface IProps {
  postNewDocument: (body: IPostFileBody) => Promise<void>;
  document: File;
  objectId: string | number;
  user: KeycloakTokenParsed | undefined;
  externalSkip?: boolean;
}

const createBody = (
  objectId: number | string,
  base64File: string,
  file: File,
  user: KeycloakTokenParsed | undefined,
): IPostFileBody => {
  const fileSizeMegabyte = fileSizeInMegabyte(file.size);
  const fileNameWithoutType = file.name.split('.')[0];
  return {
    name: fileNameWithoutType,
    status: 'created',
    externalIdentifier: [
      {
        href: `${config._apiBase8000}inventory/object/${objectId}/grouped_parameters?only_filled=true`,
        id: objectId,
        owner: user ? user.upn : `${config._apiBase8000}inventory`,
      },
    ],
    attachment: [
      {
        content: base64File,
        mimeType: file.type,
        attachmentType: file.name.split('.').pop()!,
        name: file.name,
        size: { amount: +fileSizeMegabyte, units: 'MB' },
      },
    ],
  };
};

export const addNewDocument = async ({
  postNewDocument,
  document,
  objectId,
  user,
  externalSkip,
}: IProps) => {
  const base64FromDocument = await file2Base64(document);
  const body = createBody(objectId, base64FromDocument, document, user);
  await postNewDocument({ ...body, externalSkip });
};
