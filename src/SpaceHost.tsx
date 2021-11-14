import { useEffect, useState } from 'react';
import SpaceRenderer, { SpaceProps } from './SpaceRenderer';

export default function SpaceHost() {
	const [ws] = useState(() => new WebSocket('ws://localhost:8080/ws'));
	const [space, setSpace] = useState<SpaceProps>();

	useEffect(() => {
		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					cmd: 'set-name',
					body: 'test',
				})
			);
		};
		ws.onmessage = message => {
			setSpace(JSON.parse(message.data));
		};
	}, [ws]);

	if (space) {
		return <SpaceRenderer space={space} ws={ws} />;
	} else {
		return null;
	}
}
