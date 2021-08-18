import { useContext } from 'react';
import Audio from './Audio';
import { CallContext } from './AudioCall';
import Video from './Video';

export default function Room() {
	const call = useContext(CallContext);

	return (
		<div>
			<h1>Room</h1>
			<button
				onClick={() => call.setLocalCameraEnabled(!call.localCameraEnabled)}
			>
				{call.localCameraEnabled ? 'Camera Enabled' : 'Camera Disabled'}
			</button>
			<button
				onClick={() => call.setLocalAudioEnabled(!call.localAudioEnabled)}
			>
				{call.localAudioEnabled ? 'Microphone Enabled' : 'Microphone Disabled'}
			</button>
			<br />

			{call.localCameraTrack && call.localCameraEnabled && (
				<Video
					track={call.localCameraTrack.getMediaStreamTrack()}
					style={{ transform: 'scaleX(-1)' }}
				/>
			)}

			{call.localAudioTrack && call.localAudioEnabled && (
				<Audio track={call.localAudioTrack.getMediaStreamTrack()} />
			)}

			{Object.entries(call.participants).map(([id, participant]) => (
				<div key={id}>
					<h2>{id}</h2>
					{participant.audio && <Audio track={participant.audio} />}
				</div>
			))}
		</div>
	);
}
