const SUPPORTED_EXTENSIONS = ['obj', 'fbx', 'glb']; // 'gltf'

export const isValidModelLink = (link: string) => {
  const fileExtension = link.split('.').pop()?.toLowerCase();

  return fileExtension !== undefined && SUPPORTED_EXTENSIONS.includes(fileExtension);
};
