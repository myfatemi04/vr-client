import { useEffect, useRef, useState } from 'react';
import SpaceRenderer, { SpaceProps } from './SpaceRenderer';

export default function SpaceHost() {
	const wsRef = useRef<WebSocket>();
	const [space, setSpace] = useState<SpaceProps>();

	useEffect(() => {
		wsRef.current = new WebSocket('ws://localhost:8080');
		const ws = wsRef.current;
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
	}, []);

	if (space) {
		return <SpaceRenderer space={space} />;
	} else {
		return null;
	}
}
