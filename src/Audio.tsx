import { useLayoutEffect, useMemo, useRef } from 'react';

export default function Audio({
	track,
	muted = false,
}: {
	track: MediaStreamTrack;
	muted?: boolean;
}) {
	const stream = useMemo(() => new MediaStream([track]), [track]);
	const ref = useRef<HTMLAudioElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;

		if (!ref.current.paused) {
			ref.current.pause();
		}

		ref.current.srcObject = stream;
		ref.current.play();
	}, [stream]);

	return <audio ref={ref} muted={muted} />;
}
