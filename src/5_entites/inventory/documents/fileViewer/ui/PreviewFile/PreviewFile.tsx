import { Suspense, useRef, useState } from 'react';
import { IconButton, Link, Box, Tooltip } from '@mui/material';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useTranslate, Modal } from '6_shared';
import * as SC from './PreviewFile.styled';
// import { previewableFileTypes } from '../../lib';

const GLTFModel = ({ link }: { link: string }) => {
  const mesh = useRef();
  const model = useLoader(GLTFLoader, link);

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <primitive object={model.scene} />
    </mesh>
  );
};
const ObjModel = ({ link }: { link: string }) => {
  const mesh = useRef();
  const model = useLoader(OBJLoader, link);

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <primitive object={model} />
    </mesh>
  );
};

interface IProps {
  fileLink: string;
  fileType: string;
  mimeType: string;
}

export const PreviewFile = ({ fileLink, fileType, mimeType }: IProps) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);

  const onPreviewClick = () => {
    setOpen(true);
  };

  // const isPreviewable = previewableFileTypes.includes(fileType);
  const isPreviewable =
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('application');

  return (
    <Box component="div">
      <Tooltip
        title={!isPreviewable ? translate('Preview is not available') : translate('Preview')}
      >
        <Box component="div">
          <IconButton disabled={!isPreviewable} onClick={onPreviewClick}>
            {fileType === 'glb' || fileType === 'obj' ? (
              <SC.VisibilityIconStyled />
            ) : (
              <Link height="22px" color="inherit" href={fileLink} target="_blank">
                <SC.VisibilityIconStyled />
              </Link>
            )}
          </IconButton>
        </Box>
      </Tooltip>

      {(fileType === 'glb' || fileType === 'gltf' || fileType === 'obj') && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          width={500}
          height={500}
          ModalContentSx={{ width: '100%', height: '100%' }}
        >
          <SC.PreviewContent>
            <Canvas style={{ width: '100%', height: '100%' }}>
              {fileType !== 'obj' ? (
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[10, 0, 5]} />
                  <OrbitControls target={[0, 4, 0]} />
                  <ambientLight intensity={0.3} />
                  <spotLight
                    intensity={1}
                    color="#366ea4"
                    angle={0.1}
                    penumbra={1}
                    position={[10, 50, 10]}
                    castShadow
                  />
                  <spotLight
                    intensity={1}
                    color="#4992da"
                    angle={0.1}
                    penumbra={1}
                    position={[0, 50, 10]}
                    castShadow
                  />
                  <spotLight
                    intensity={1}
                    color="#daeaff"
                    angle={0.1}
                    penumbra={1}
                    position={[0, 120, 10]}
                    castShadow
                  />
                  <spotLight
                    intensity={1}
                    color="#044172"
                    angle={180}
                    penumbra={1}
                    position={[0, 0, -10]}
                    castShadow
                  />
                  {fileType === 'glb' && <GLTFModel link={fileLink} />}
                  {fileType === 'gltf' && <GLTFModel link={fileLink} />}
                </Suspense>
              ) : (
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 0, -25]} />
                  <OrbitControls target={[0, 10, 0]} />
                  <ambientLight intensity={0.1} />
                  <spotLight
                    intensity={0.8}
                    color="#366ea4"
                    angle={0.1}
                    penumbra={1}
                    position={[10, 50, 10]}
                    castShadow
                  />
                  <spotLight
                    intensity={0.8}
                    color="#4992da"
                    angle={0.1}
                    penumbra={1}
                    position={[-10, 50, 10]}
                    castShadow
                  />
                  <spotLight
                    intensity={0.5}
                    color="#daeaff"
                    angle={0.1}
                    penumbra={1}
                    position={[0, 90, 10]}
                    castShadow
                  />
                  <spotLight
                    intensity={0.8}
                    color="#044172"
                    angle={180}
                    penumbra={1}
                    position={[0, 0, -10]}
                    castShadow
                  />
                  <ObjModel link={fileLink} />
                </Suspense>
              )}
            </Canvas>
          </SC.PreviewContent>
        </Modal>
      )}
    </Box>
  );
};
