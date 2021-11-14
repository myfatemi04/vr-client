import { TrackballControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
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

const User = ({ props }: { props: UserProps }) => {
	return (
		<mesh position={[props.x, 0, props.y]}>
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
	return (
		<Canvas style={{ borderColor: 'white' }}>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<camera position={[me.x, 0, me.y]} />
			{Object.values(space.users).map((user: UserProps) => (
				<User key={user.name} props={user} />
			))}
			<TrackballControls />
		</Canvas>
	);
}
