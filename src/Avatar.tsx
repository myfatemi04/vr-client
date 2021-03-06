import { useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import useSmooth from './useSmooth';

const readyPlayerMeUrl =
	'https://d1a370nemizbjq.cloudfront.net/9802053f-1d0a-405e-8853-00fed2065724.glb';

export default function Avatar({
	position,
	rotation,
}: {
	position: [number, number, number];
	rotation: [number, number, number];
}) {
	const model = useLoader(GLTFLoader, readyPlayerMeUrl);

	const x = useSmooth(position[0]);
	const y = useSmooth(position[1]);
	const z = useSmooth(position[2]);

	const yRotation = useSmooth(rotation[1] + Math.PI);

	return (
		<primitive
			object={model.scene}
			position={[x, y, z]}
			rotation={[rotation[0], yRotation, rotation[2]]}
		/>
	);
}
