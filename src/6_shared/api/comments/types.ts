export interface Comment {
  author: string;
  text: string;
  object_id: number;
  id: number;
  created: Date;
  changed: Date;
}

export interface CommentsObjectModel {
  quantity: number;
  comments: Comment[];
}

export interface GetObjectCommentsRequestParam {
  id: number;
  limit?: number | undefined;
  offset?: number | undefined;
  created_from?: Date | string;
  created_to?: Date | string;
  contains?: string | undefined;
}

export interface IComment {
  author: string;
  text: string;
  object_id: number;
  group?: string | null;
}

export interface CreateObjectCommentBody {
  id: number;
  body: IComment;
}

export interface UpdateObjectCommentBody extends CreateObjectCommentBody {}

export interface CreateDefaultCommentBody extends Omit<IComment, 'object_id'> {}

export interface DefaultComment extends Omit<Comment, 'object_id'> {
  group?: string | null;
}

export interface GetDefaultCommentsRequestParams extends Omit<GetObjectCommentsRequestParam, 'id'> {
  group?: string | null;
}

export interface DefaultCommentsModel {
  quantity: number;
  comments: DefaultComment[];
}

export interface UpdateDefaultCommentBody {
  id: number;
  body: CreateDefaultCommentBody;
}
