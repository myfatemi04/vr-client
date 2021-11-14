import { TrackballControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

export type UserProps = {
	name: string;
	x: number;
	y: number;
};

export type SpaceProps = {
	[userID: string]: UserProps;
};

const User = ({ props }: { props: UserProps }) => {
	return (
		<mesh position={[props.x, props.y + 10 * Math.random(), 0]}>
			<boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
			<meshStandardMaterial attach='material' color='red' />
		</mesh>
	);
};

/**
 * Renders the content of a space.
 */
export default function SpaceRenderer({ space }: { space: SpaceProps }) {
	return (
		<Canvas style={{ borderColor: 'white' }}>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<camera position={[0, 0, 0]} />
			{Object.values(space).map((user: UserProps) => (
				<User key={user.name} props={user} />
			))}
			<TrackballControls />
		</Canvas>
	);
}
