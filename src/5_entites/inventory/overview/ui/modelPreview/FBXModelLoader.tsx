import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

interface IProps {
  modelPath: string;
}

export const FBXModelLoader = ({ modelPath }: IProps) => {
  const fbx = useLoader(FBXLoader, modelPath);

  return (
    <group>
      <primitive object={fbx} />
    </group>
  );
};
