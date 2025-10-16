interface IProps {
  addObjectModelFn: (body: FormData) => Promise<void>;
  objectId: number | null;
  file: File | null;
}

export const addObjectModel = async ({ addObjectModelFn, objectId, file }: IProps) => {
  if (objectId !== null && file !== null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', objectId.toString());

    await addObjectModelFn(formData);
  }
};
