interface IFileSize {
  amount: number;
  units: string;
}

interface IBaseAttachment {
  name: string;
  attachmentType: string;
  mimeType: string;
  size: IFileSize;
}

interface IAttachment extends IBaseAttachment {
  id: string;
  url: string;
}

export interface IFileData {
  attachment: IAttachment[];
  creationDate: string;
  externalIdentifier: [
    {
      href: string;
      id: string;
      owner: string;
    },
  ];
  lastUpdate: Date;
  name: string;
  status: string;
  href: string;
  id: string;
  tempFile?: File;
}

interface UpdateFileAttachment extends IBaseAttachment {
  id: string;
  content: string;
  url?: string;
}

interface ICreateFileAttachment extends IBaseAttachment {
  content: string;
}

export interface IPostFileBody {
  name: string;
  status: string;
  externalIdentifier: ExternalIdentifier[];
  attachment: ICreateFileAttachment[];
  externalSkip?: boolean;
}

export interface IAddDocumentToObjectByIdBody {
  objectId: number;
  body: FormData;
}

interface ExternalIdentifier {
  href: string;
  id: number | string;
  owner: string;
}

export interface UpdateFileBody {
  id: string | number;
  body: {
    attachment?: UpdateFileAttachment[];
    creationDate?: string;
    externalIdentifier?: ExternalIdentifier[];
    lastUpdate?: string;
    name?: string;
    status?: string;
    href?: string;
    id?: string;
  };
}
