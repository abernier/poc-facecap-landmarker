import { type ComponentProps } from "react";

function Cube({ children, ...props }: ComponentProps<"mesh">) {
  return (
    <mesh castShadow {...props}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="blue" />
      {children}
    </mesh>
  );
}

export default Cube;
