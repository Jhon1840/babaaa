import { View, Text } from 'react-native'
import { Canvas } from "@react-three/fiber/native";
import { Box, Plane } from "@react-three/drei/native";
import React, {useEffect, useState} from 'react'
import { supabase } from '@/utils/supabase';
import model from '@/assets/model/amongus.glb'
import { useGLTF } from '@react-three/drei/native'

export function Model(props) {
  const { nodes, materials } = useGLTF(model)
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.piernas.geometry}
        material={materials['Material Rojo']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cristal.geometry}
        material={materials.Cristal}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mochila.geometry}
        material={materials['Material Rojo']}
      />
      <mesh castShadow receiveShadow geometry={nodes.Plane.geometry} material={materials.Birrete} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.amongos_cuerpo_copia.geometry}
        material={materials['Material Rojo']}
      />
      <mesh castShadow receiveShadow geometry={nodes.gorro.geometry} material={materials.Birrete} />
      <mesh castShadow receiveShadow geometry={nodes.boton.geometry} material={materials.Botton} />
    </group>
  )
}

const Threed = () => {
  const [rotation, setRotation] = useState<[number, number, number]>([0,0,0])

  useEffect(() => {
    const subscription = supabase.channel('room-1')
      .on('broadcast', { event: 'new-data' }, (payload) => {
          const r = payload.payload.accelerometerGyroscopeData
          setRotation([r.gx, r.gz, r.gy])
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Canvas>
        <ambientLight />
        <directionalLight
          position={[0, 1, 1]}
          castShadow
          color={"#a8e344f"}
        />
        <Box position={[0, 0.5, 0]} rotation={rotation} castShadow />
        {/* <Model position={[0, 0, 0]} rotation={rotation} castShadow /> */}
        <Plane
          args={[10, 10]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        />
      </Canvas>
      <View style={{ position: "absolute", top: 40, left: 10 }}>
        <Text style={{ color: "black" }}>X: {rotation[0].toFixed(2)}</Text>
        <Text style={{ color: "black" }}>Y: {rotation[1].toFixed(2)}</Text>
        <Text style={{ color: "black" }}>Z: {rotation[2].toFixed(2)}</Text>
      </View>
    </View>
  )
}

export default Threed