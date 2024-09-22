import * as THREE from "three";
import styled from "@emotion/styled";
import { Canvas, useThree } from "@react-three/fiber";
import { KTX2Loader } from "three-stdlib";

import Layout from "./Layout";
import {
  Clone,
  FaceControls,
  FaceLandmarker,
  useFaceLandmarker,
  useGLTF,
} from "@react-three/drei";

import facecap from "./facecap.glb?url";
import { useCallback, useState } from "react";

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath(
  `https://unpkg.com/three@0.168.0/examples/jsm/libs/basis/`
);

function App() {
  return (
    <Styled>
      <Canvas>
        <Layout>
          <FaceLandmarker>
            <Scene />
          </FaceLandmarker>
        </Layout>
      </Canvas>
    </Styled>
  );
}
export const Styled = styled.div`
  position: fixed;
  inset: 0;
`;
export default App;

type Blendshape = {
  name: string;
  value: number;
};

function Scene() {
  const [cam] = useState(new THREE.PerspectiveCamera());

  const [blendshapes, setBlendshapes] = useState<Blendshape[]>([]);

  const faceLandmarker = useFaceLandmarker();

  const onVideoFrame = useCallback(
    (event) => {
      const result = faceLandmarker?.detectForVideo(
        event.texture.source.data,
        event.time
      );
      console.log("result=", result?.faceBlendshapes[0]?.categories);

      const categories = result?.faceBlendshapes[0]?.categories;
      if (categories) {
        setBlendshapes(
          result?.faceBlendshapes[0]?.categories.map(
            ({ categoryName, score }) => ({ name: categoryName, value: score })
          )
        );
      }
    },
    [faceLandmarker]
  );

  return (
    <>
      <FaceControls
        camera={cam}
        manualUpdate={true}
        manualDetect
        onVideoFrame={onVideoFrame}
      />
      <Facecap blendshapes={blendshapes} />
    </>
  );
}

const map = {
  browInnerUp: "browInnerUp",
  browDown_L: "browDownLeft",
  browDown_R: "browDownRight",
  browOuterUp_L: "browOuterUpLeft",
  browOuterUp_R: "browOuterUpRight",
  eyeLookUp_L: "eyeLookUpLeft",
  eyeLookUp_R: "eyeLookUpRight",
  eyeLookDown_L: "eyeLookDownLeft",
  eyeLookDown_R: "eyeLookDownRight",
  eyeLookIn_L: "eyeLookInLeft",
  eyeLookIn_R: "eyeLookInRight",
  eyeLookOut_L: "eyeLookOutLeft",
  eyeLookOut_R: "eyeLookOutRight",
  eyeBlink_L: "eyeBlinkLeft",
  eyeBlink_R: "eyeBlinkRight",
  eyeSquint_L: "eyeSquintLeft",
  eyeSquint_R: "eyeSquintRight",
  eyeWide_L: "eyeWideLeft",
  eyeWide_R: "eyeWideRight",
  cheekPuff: "cheekPuff",
  cheekSquint_L: "cheekSquintLeft",
  cheekSquint_R: "cheekSquintRight",
  noseSneer_L: "noseSneerLeft",
  noseSneer_R: "noseSneerRight",
  jawOpen: "jawOpen",
  jawForward: "jawForward",
  jawLeft: "jawLeft",
  jawRight: "jawRight",
  mouthFunnel: "mouthFunnel",
  mouthPucker: "mouthPucker",
  mouthLeft: "mouthLeft",
  mouthRight: "mouthRight",
  mouthRollUpper: "mouthRollUpper",
  mouthRollLower: "mouthRollLower",
  mouthShrugUpper: "mouthShrugUpper",
  mouthShrugLower: "mouthShrugLower",
  mouthClose: "mouthClose",
  mouthSmile_L: "mouthSmileLeft",
  mouthSmile_R: "mouthSmileRight",
  mouthFrown_L: "mouthFrownLeft",
  mouthFrown_R: "mouthFrownRight",
  mouthDimple_L: "mouthDimpleLeft",
  mouthDimple_R: "mouthDimpleRight",
  mouthUpperUp_L: "mouthUpperUpLeft",
  mouthUpperUp_R: "mouthUpperUpRight",
  mouthLowerDown_L: "mouthLowerDownLeft",
  mouthLowerDown_R: "mouthLowerDownRight",
  mouthPress_L: "mouthPressLeft",
  mouthPress_R: "mouthPressRight",
  mouthStretch_L: "mouthStretchLeft",
  mouthStretch_R: "mouthStretchRight",
  tongueOut: "",
};

function Facecap({ blendshapes }: { blendshapes: Blendshape[] }) {
  const { gl } = useThree();
  const model = useGLTF(facecap, undefined, undefined, (loader) => {
    loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
  });

  const facelandmarker = useFaceLandmarker();
  console.log("facelandmarker=", facelandmarker);

  const mesh = model.scene.children[0];
  const head = mesh.getObjectByName("mesh_2") as THREE.Mesh & {
    morphTargetInfluences: number[];
    morphTargetDictionary: { [key: string]: number };
  };
  head.traverse((child) => (child.castShadow = child.receiveShadow = true));

  const influences = head.morphTargetInfluences;
  // console.log("influences=", influences);
  const dictionary = head.morphTargetDictionary;
  // console.log("dictionary=", dictionary);

  for (const [key, value] of Object.entries(dictionary)) {
    const blendshape = blendshapes.find(({ name }) => name === map[key]);
    // console.log(key, value);
    if (blendshape) {
      influences[value] = blendshape.value;
    }
  }

  return <Clone object={mesh} />;
}
