"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { useDroneColorIndex, FINISHES } from "@/lib/drone-store";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_7: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_9: THREE.Mesh;
  };
  materials: {
    lineGrey?: THREE.LineBasicMaterial;
    black?: THREE.MeshStandardMaterial;
    chrome?: THREE.MeshStandardMaterial;
    glass?: THREE.MeshStandardMaterial;
    grey?: THREE.MeshStandardMaterial;
    [key: string]: THREE.Material | undefined;
  };
};

/**
 * Object_8 is the hull: it's the only solid mesh sharing the "grey"
 * material with the Object_9 wireframe outline traced over it — that
 * outline-over-shape pairing is what identifies it as the body. Object_2
 * is the arms/wings (stays static black), Object_6 is chrome legs/hubs,
 * Object_7 is the glass dome.
 */
const BODY_NODE_KEY: keyof GLTFResult["nodes"] = "Object_8";

export function Model({
  bodyMaterial,
  ...groupProps
}: React.ComponentProps<"group"> & {
  bodyMaterial?: THREE.MeshStandardMaterial;
}) {
  const { nodes, materials } = useGLTF(
    "/models/drone-transformed.glb",
  ) as unknown as GLTFResult;

  return (
    <group {...groupProps} dispose={null}>
      {nodes.Object_9 && materials.grey && (
        <lineSegments
          geometry={nodes.Object_9.geometry}
          material={materials.grey as unknown as THREE.LineBasicMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
      {nodes.Object_2 && materials.black && (
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.black}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
      {nodes.Object_6 && materials.chrome && (
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials.chrome}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
      {nodes.Object_7 && materials.glass && (
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials.glass}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
      {nodes[BODY_NODE_KEY] && (
        <mesh
          geometry={nodes[BODY_NODE_KEY].geometry}
          material={bodyMaterial ?? materials.grey ?? materials.black}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
    </group>
  );
}

useGLTF.preload("/models/drone-transformed.glb");

export function DroneRig({
  groupRef,
  targetSize = 2.6,
  onPointerDown,
  onPointerUp,
  onPointerOver,
  onPointerOut,
}: {
  groupRef: React.RefObject<THREE.Group | null>;
  targetSize?: number;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerUp?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  const { materials } = useGLTF(
    "/models/drone-transformed.glb",
  ) as unknown as GLTFResult;

  const bodyMaterial = useMemo(() => {
    const base = materials.grey;
    if (!base) {
      console.warn(
        "[Drone] No material named 'grey' on this GLTF — using a fallback. Available keys:",
        Object.keys(materials),
      );
      return new THREE.MeshStandardMaterial({
        color: FINISHES[0].hex,
        metalness: 0.3,
        roughness: 0.6,
      });
    }
    return base.clone();
  }, [materials]);

  const innerRef = useRef<THREE.Group>(null);
  const [hitRadius, setHitRadius] = useState(0);

  const colorIndex = useDroneColorIndex();
  const currentColor = useRef(new THREE.Color(FINISHES[0].hex));
  const targetColor = useRef(new THREE.Color(FINISHES[colorIndex].hex));

  useEffect(() => {
    targetColor.current.set(FINISHES[colorIndex].hex);
  }, [colorIndex]);

  useEffect(() => {
    if (!innerRef.current) return;
    innerRef.current.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(innerRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    innerRef.current.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    if (groupRef.current) {
      groupRef.current.userData.baseScale = targetSize / maxDim;
    }
    setHitRadius(maxDim * 0.6);
  }, [targetSize, groupRef]);

  useFrame((_, delta) => {
    currentColor.current.lerp(targetColor.current, delta * 4);
    bodyMaterial.color.copy(currentColor.current);
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <group
        ref={innerRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <Model bodyMaterial={bodyMaterial} />
      </group>
      {hitRadius > 0 && (
        <mesh>
          <sphereGeometry args={[hitRadius, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
