import { PointerLockControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { PerspectiveCamera } from 'three';
import { City } from './Models';
import useKeyboardControls from './useKeyboardControls';

export type UserProps = {
	name: string;
	x: number;
	y: number;
};

export type SpaceProps = {
	uid: string;
	users: {
		[uid: string]: UserProps;
	};
};

const useSmooth = (value: number) => {
	const [smooth, setSmooth] = useState(value);
	useEffect(() => {
		const interval = setInterval(() => {
			setSmooth(smooth => smooth * 0.8 + value * 0.2);
		}, 1000 / 60);
		return () => clearInterval(interval);
	}, [value]);
	return smooth;
};

const User = ({ props }: { props: UserProps }) => {
	const x = useSmooth(props.x);
	const y = useSmooth(props.y);

	return (
		<mesh position={[x, 0, y]}>
			<boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
			<meshStandardMaterial attach='material' color='red' />
		</mesh>
	);
};

/**
 * Renders the content of a space.
 */
export default function SpaceRenderer({
	ws,
	space,
}: {
	ws: WebSocket;
	space: SpaceProps;
}) {
	const me = space.users[space.uid];
	useKeyboardControls({ ws, me });
	const camera = useState(() => new PerspectiveCamera())[0];

	const x = useSmooth(me.x);
	const y = useSmooth(me.y);

	camera.position.set(x, 0, y);

	return (
		<div style={{ width: '600px', height: '400px', border: '2px solid white' }}>
			<Canvas camera={camera}>
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{Object.values(space.users).map((user: UserProps) => (
					<User key={user.name} props={user} />
				))}
				<PointerLockControls camera={camera} />
				<Suspense fallback={null}>
					{/* <SushiTable /> */}
					<City />
				</Suspense>
			</Canvas>
		</div>
	);
}
