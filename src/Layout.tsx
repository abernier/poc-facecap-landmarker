import * as THREE from "three";
import { ElementRef, useRef, type ReactNode } from "react";
import {
  CameraControls,
  Environment,
  Helper,
  PerspectiveCamera,
  useHelper,
} from "@react-three/drei";

import { useControls, folder } from "leva";

function Layout({
  children,
  bg = "#333",
}: {
  children?: ReactNode;
  bg?: string;
}) {
  const [gui, setGui] = useControls(() => ({
    Layout: folder(
      {
        bg,
        grid: true,
        axes: true,
        ambientIntensity: 0.15,
        spotLightIntensity: 250,
        spotLightHelper: false,
      },
      { collapsed: true }
    ),
  }));
  // console.log("gui=", gui);

  const spotLightRef = useRef<ElementRef<"spotLight">>(null!);
  useHelper(gui.spotLightHelper && spotLightRef, THREE.SpotLightHelper);

  return (
    <>
      <Camera />
      <CameraControls />

      <Environment background>
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial color={gui.bg} side={THREE.BackSide} />
        </mesh>
      </Environment>

      <spotLight
        ref={spotLightRef}
        position={[7, 7, 7]}
        castShadow
        intensity={gui.spotLightIntensity}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={gui.ambientIntensity} />

      {/* {gui.grid && <gridHelper args={[30, 30, 30]} position-y=".01" />}
      {gui.axes && <axesHelper args={[5]} />} */}

      {children}
    </>
  );
}

function Camera() {
  const [gui, setGui] = useControls(() => ({
    Camera: folder(
      {
        fov: 35,
        position: { value: [0, -0.2, 2], step: 0.1 },
        // lookAt: {
        //   value: [0, 0, 0],
        //   step: 0.1,
        // },
      },
      { collapsed: true }
    ),
  }));

  return (
    <>
      <PerspectiveCamera
        {...{ fov: gui.fov, position: gui.position }}
        makeDefault
      />
    </>
  );
}

export default Layout;
