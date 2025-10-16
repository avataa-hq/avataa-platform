import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export const CameraControls = () => {
  const { camera, gl } = useThree();

  return <OrbitControls args={[camera, gl.domElement]} target={[10, 0, 0]} />;
};
