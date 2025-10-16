import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import { Light } from './Light';
import { extractModelPath } from '../../lib/extractModelPath';
import { isValidModelLink } from '../../lib/isValidModelLink';
import { CameraControls } from './CameraControls';
import { OBJModelLoader } from './OBJModelLoader';
import { FBXModelLoader } from './FBXModelLoader';
import { GLBModelLoader } from './GLBModelLoader';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

interface IProps {
  modelLink: string;
  setModelError: React.Dispatch<React.SetStateAction<boolean>>;
  setModelPath: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ModelPreview = ({ modelLink, setModelError, setModelPath }: IProps) => {
  const newModelPath = extractModelPath(modelLink);

  const [fileExtension, setFileExtension] = useState('obj');

  useEffect(() => {
    const extractedExtension = modelLink.split('.').pop();
    if (extractedExtension) {
      setFileExtension(extractedExtension.slice(0, 3));
    }
  }, [modelLink]);

  useEffect(() => {
    setModelPath(newModelPath);
    setModelError(!isValidModelLink(newModelPath));
  }, [newModelPath, setModelError, setModelPath]);

  return (
    <Canvas shadows camera={{ fov: 45, position: [0, 0, 0], far: 5000 }}>
      <color attach="background" args={[0.9, 0.9, 0.9]} />
      <CameraControls />
      <Light />
      <Suspense fallback={<Loader />}>
        {/* <ModelLoader modelPath={newModelPath} fileExtension={fileExtension} /> */}
        {fileExtension === 'fbx' && <FBXModelLoader modelPath={newModelPath} />}
        {fileExtension === 'obj' && <OBJModelLoader modelPath={newModelPath} />}
        {fileExtension === 'glb' && <GLBModelLoader modelPath={newModelPath} />}
        {/* <mesh position={[50, -120, -500]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeBufferGeometry args={[1000, 1000]} />
          <meshBasicMaterial color={0xcccccc} />
        </mesh> */}
      </Suspense>
    </Canvas>
  );
};
