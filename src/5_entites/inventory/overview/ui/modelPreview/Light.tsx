const angleToRadians = (angleInDeg: number) => (Math.PI / 180) * angleInDeg;

export const Light = () => {
  return (
    <>
      <rectAreaLight intensity={8} color="#153349" position={[0, 0, 3]} height={50} width={50} />
      <ambientLight intensity={0.2} color="#ffffff" />
      {/* <pointLight intensity={1} color="#ff0000" position={[5, 5, 5]} />
      <pointLight intensity={1} color="#00ff00" position={[-5, 5, 5]} />
      <pointLight intensity={1} color="#0000ff" position={[0, 5, -5]} /> */}
      <directionalLight intensity={1} color="#ffffff" position={[0, 5, 5]} />
      <directionalLight intensity={1} color="#ffffff" position={[-5, 5, 0]} />
      <directionalLight intensity={1} color="#ffffff" position={[5, 5, 0]} />
      <spotLight
        distance={30}
        color="#ffffff"
        intensity={2}
        // angle={angleToRadians(30)}
        penumbra={0.5}
        position={[0, 15, 0]}
        // castShadow
      />
    </>
  );
};
