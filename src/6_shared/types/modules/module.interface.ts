export interface IModuleContent {
  component?: React.ReactNode | null;
  icon?: React.ReactNode | null;
}

export interface IModule<T extends string = string> {
  id: T;
  label: string;
  isGroup?: boolean;
  isHidden?: boolean;
  isAccessible?: boolean;
  content?: IModuleContent;
  parentId?: string;
  nonClosable?: boolean;
  role: string;
}
