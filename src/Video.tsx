import { CSSProperties, useLayoutEffect, useMemo, useRef } from 'react';

export default function Video({
	track,
	muted = false,
	style,
}: {
	track: MediaStreamTrack;
	muted?: boolean;
	style?: CSSProperties;
}) {
	const stream = useMemo(() => new MediaStream([track]), [track]);
	const ref = useRef<HTMLVideoElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;

		if (!ref.current.paused) {
			ref.current.pause();
		}

		ref.current.srcObject = stream;
		ref.current.play();
	}, [stream]);

	return <video ref={ref} muted={muted} style={style} />;
}
