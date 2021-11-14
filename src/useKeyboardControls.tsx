import { useEffect } from 'react';
import { UserProps } from './SpaceRenderer';

const changes = {
	a: { x: -1, y: 0 },
	d: { x: 1, y: 0 },
	w: { x: 0, y: -1 },
	s: { x: 0, y: 1 },
};

export default function useKeyboardControls({
	ws,
	me,
}: {
	ws: WebSocket;
	me: UserProps;
}) {
	useEffect(() => {
		document.onkeydown = e => {
			if ('asdw'.includes(e.key)) {
				ws.send(
					JSON.stringify({
						cmd: 'set-position',
						body: {
							// @ts-expect-error
							x: me.x + changes[e.key].x,
							// @ts-expect-error
							y: me.y + changes[e.key].y,
						},
					})
				);
			}
		};
	}, [me.x, me.y, ws]);
}
