import { useState } from "react";
import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";

import Layout from "./Layout";
import Cube from "./components/Cube";
import Ground from "./components/Ground";

function App() {
  return (
    <Styled>
      <Canvas
        shadows
        // camera={{
        //   position: [0, 15, 5],
        //   fov: 55,
        // }}
        //
      >
        <Layout>
          <Scene />
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

function Scene() {
  return (
    <>
      <Cube position-y={1} />
      <Ground />
    </>
  );
}
