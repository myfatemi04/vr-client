import { useEffect } from 'react';
import { UserProps } from './SpaceRenderer';

export default function useKeyboardControls({
	ws,
	me,
	rotation,
}: {
	ws: WebSocket;
	me: UserProps;
	rotation: number;
}) {
	useEffect(() => {
		document.onkeydown = e => {
			if ('sdwa'.includes(e.key)) {
				const idx = 'sdwa'.indexOf(e.key);
				ws.send(
					JSON.stringify({
						cmd: 'set-position',
						body: {
							x: me.x + Math.sin(rotation + (idx * Math.PI) / 2),
							y: me.y + Math.cos(rotation + (idx * Math.PI) / 2),
						},
					})
				);
			}
		};
	}, [me.x, me.y, rotation, ws]);
}
