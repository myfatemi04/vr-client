import { useLoader } from 'react-three-fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function SushiTable() {
	// Attribution: Aimi Sekiguchi
	// https://poly.google.com/user/c6UmSrlqUaJ/
	// TODO: Put attribution on page itself for actual release
	// (Only developers see it right now so the attribution is in the code)
	const table = useLoader(
		GLTFLoader,
		'https://nebulamodels.s3.amazonaws.com/models/sushi_table/model.gltf'
	);
	return (
		<primitive object={table.scene} scale={[2, 2, 2]} position={[0, -1.9, 0]} />
	);
}

export function City() {
	const model = useLoader(
		FBXLoader,
		'https://nebulamodels.s3.amazonaws.com/models/cartoon_city/model.fbx'
	);
	return (
		<primitive object={model} scale={[0.02, 0.02, 0.02]} position={[0, 2, 0]} />
	);
}
