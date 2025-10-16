import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';

interface IProps {
  modelPath: string;
}

export const OBJModelLoader = ({ modelPath }: IProps) => {
  const objLoader = useLoader(OBJLoader, modelPath);

  return (
    <group>
      <primitive object={objLoader} />
    </group>
  );
};
