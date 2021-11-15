import { PointerLockControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { BackSide, PerspectiveCamera } from 'three';
import Avatar from './Avatar';
import { City } from './Models';
import useKeyboardControls from './useKeyboardControls';
import useSmooth from './useSmooth';

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
	const canvas = useRef<HTMLCanvasElement>(null);

	const me = space.users[space.uid];
	const camera = useState(() => new PerspectiveCamera())[0];

	useEffect(() => {
		camera.setFocalLength(10);
	}, [camera]);

	const x = useSmooth(me.x);
	const y = useSmooth(me.y);

	camera.position.set(x, 1.5, y);
	useKeyboardControls({ ws, me, rotation: camera.rotation.reorder('YZX').y });

	return (
		<div
			style={{ width: '1000px', height: '600px', border: '2px solid white' }}
		>
			<Canvas camera={camera} ref={canvas}>
				<mesh>
					<boxBufferGeometry attach='geometry' args={[100, 100, 100]} />
					<meshBasicMaterial
						attach='material'
						color='#48006f'
						side={BackSide}
					/>
				</mesh>
				<hemisphereLight color='black' />
				<PointerLockControls camera={camera} />
				<Suspense fallback={null}>
					{Object.entries(space.users).map(
						([uid, user]) =>
							uid !== space.uid && (
								<Avatar key={uid} position={[user.x, 0, user.y]} />
							)
					)}
					{/* <SushiTable /> */}
					<City />
				</Suspense>
			</Canvas>
		</div>
	);
}
