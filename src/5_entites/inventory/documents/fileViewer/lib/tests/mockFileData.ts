import { IFileData } from '6_shared';

const mockMissingProperties = {
  href: '',
  id: '',
  lastUpdate: new Date(),
  status: '',
};

const mockAttachmentMissingProperties = {
  id: '',
  mimeType: '',
  url: '',
  size: {
    amount: 0,
    units: '',
  },
};

export const mockFileData: IFileData[] = [
  {
    creationDate: '2024-09-30',
    attachment: [
      {
        name: 'presentation.docx',
        attachmentType: 'docx',
        ...mockAttachmentMissingProperties,
      },
    ],
    ...mockMissingProperties,
    name: 'presentation.docx',
    externalIdentifier: [
      {
        href: '',
        id: '',
        owner: '',
      },
    ],
  },
  {
    creationDate: '2024-10-02',
    attachment: [
      {
        name: 'image.png',
        attachmentType: 'image',
        ...mockAttachmentMissingProperties,
      },
    ],
    ...mockMissingProperties,
    name: 'image.png',
    externalIdentifier: [
      {
        href: '',
        id: '',
        owner: '',
      },
    ],
  },
  {
    creationDate: '2024-10-01',
    attachment: [
      {
        name: 'document1.pdf',
        attachmentType: 'pdf',
        ...mockAttachmentMissingProperties,
      },
    ],
    ...mockMissingProperties,
    name: 'document1.pdf',
    externalIdentifier: [
      {
        href: '',
        id: '',
        owner: '',
      },
    ],
  },
];
