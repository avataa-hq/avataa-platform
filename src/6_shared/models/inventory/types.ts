export interface IInventoryData {
  tmoId?: number;
  objIds?: number[] | null;
  isFileDownloadModalOpen: boolean;
  changeObjectActivityStatusModal: IChangeObjectActivityStatusModal;
  isFileViewerOpen: boolean;
  isLinkedObjectsWidgetOpen: boolean;
  isRelatedObjectsWidgetOpen: boolean;
  isHistoryModalOpen: boolean;
  isChildObjectsWidgetOpen: boolean;
  isAssociatedObjectsWidgetOpen: boolean;
}

export interface IChangeObjectActivityStatusModal {
  isOpen: boolean;
  role: 'Delete' | 'Restore' | 'Delete Permanently';
}
