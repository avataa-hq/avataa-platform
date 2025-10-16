import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

interface IProps {
  modelPath: string;
}

export const GLBModelLoader = ({ modelPath }: IProps) => {
  const glb = useLoader(GLTFLoader, modelPath);

  return (
    <group>
      <primitive object={glb.scene} />
    </group>
  );
};
