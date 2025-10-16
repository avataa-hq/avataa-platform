export interface Account {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: boolean;
  // userProfileMetadata: UserProfileMetadata;
  attributes?: Attributes;
}

interface Attributes {
  [key: string]: string[];
}

// export interface UserProfileMetadata {
//   attributes: Attribute[];
// }

// export interface Attribute {
//   name: string;
//   displayName: string;
//   required: boolean;
//   readOnly: boolean;
//   validators: Validators;
// }

// export interface Validators {
//   email?: Email;
// }

// export interface Email {
//   'ignore.empty.value': boolean;
// }
