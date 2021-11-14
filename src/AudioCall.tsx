import Agora, {
	ICameraVideoTrack,
	IMicrophoneAudioTrack,
	UID,
} from 'agora-rtc-sdk-ng';
import {
	createContext,
	useCallback,
	useContext,
	useDebugValue,
	useEffect,
	useMemo,
	useState,
} from 'react';

export type CallContextProps = {
	roomID: string;
	connected: boolean;
	localParticipantUid: UID | null;
	localCameraEnabled: boolean;
	localAudioEnabled: boolean;
	localCameraTrack: ICameraVideoTrack | null;
	localAudioTrack: IMicrophoneAudioTrack | null;
	setLocalCameraEnabled: (enabled: boolean) => void;
	setLocalAudioEnabled: (enabled: boolean) => void;
	participants: Record<string, Participant>;
};

export const CallContext = createContext<CallContextProps>({
	roomID: '',
	connected: false,
	localParticipantUid: null,
	participants: {},
	localCameraEnabled: false,
	localAudioEnabled: false,
	localCameraTrack: null,
	localAudioTrack: null,
	setLocalCameraEnabled: () => {},
	setLocalAudioEnabled: () => {},
});

export type Participant = {
	name: string;
	audio?: MediaStreamTrack;
};

const appID = process.env.REACT_APP_AGORA_APP_ID;

export function useParticipants() {
	return useContext(CallContext).participants;
}

export function useParticipantAudio(uid: string) {
	const participants = useParticipants();
	return participants[uid]?.audio;
}

export default function AudioCall({
	children,
	roomID,
	token,
}: {
	children: React.ReactNode;
	roomID: string;
	token: string;
}) {
	const [connected, setConnected] = useState(false);
	const [participants, setParticipants] = useState<Record<string, Participant>>(
		{}
	);

	const client = useMemo(
		() => Agora.createClient({ mode: 'rtc', codec: 'vp8' }),
		[]
	);

	const [localParticipantUid, setLocalParticipantUid] =
		useState<UID | null>(null);

	const [localCameraEnabled, setLocalCameraEnabled_INNER] = useState(false);
	const [localAudioEnabled, setLocalAudioEnabled_INNER] = useState(false);

	const [localCameraTrack, setLocalCameraTrack] =
		useState<ICameraVideoTrack | null>(null);

	const [localAudioTrack, setLocalAudioTrack] =
		useState<IMicrophoneAudioTrack | null>(null);

	const setLocalCameraEnabled = useCallback(
		async (enabled: boolean) => {
			setLocalCameraEnabled_INNER(enabled);
			localCameraTrack?.setEnabled(enabled);
			if (enabled) {
				if (!localCameraTrack) {
					const newLocalCameraTrack = await Agora.createCameraVideoTrack();
					setLocalCameraTrack(newLocalCameraTrack);
					client.publish(newLocalCameraTrack);
				} else {
					client.publish(localCameraTrack);
				}
			} else {
				if (localCameraTrack !== null) {
					client.unpublish(localCameraTrack);
					setLocalCameraTrack(null);
				}
			}
		},
		[client, localCameraTrack]
	);

	const setLocalAudioEnabled = useCallback(
		async (enabled: boolean) => {
			setLocalAudioEnabled_INNER(enabled);
			localAudioTrack?.setEnabled(enabled);
			if (enabled) {
				if (!localAudioTrack) {
					const newLocalAudioTrack = await Agora.createMicrophoneAudioTrack();
					setLocalAudioTrack(newLocalAudioTrack);
					client.publish(newLocalAudioTrack);
				} else {
					client.publish(localAudioTrack);
				}
			} else {
				if (localAudioTrack !== null) {
					setLocalAudioTrack(null);
					client.unpublish(localAudioTrack);
				}
			}
		},
		[client, localAudioTrack]
	);

	const addParticipant = useCallback((id: string, name: string) => {
		setParticipants(participants => ({
			...participants,
			[id]: {
				name,
			},
		}));
	}, []);

	const removeParticipant = useCallback((id: string) => {
		setParticipants(({ [id]: _, ...participants }) => participants);
	}, []);

	const updateParticipant = useCallback(
		(id: string, updater: (participant: Participant) => Participant) => {
			setParticipants(participants => ({
				...participants,
				[id]: updater(participants[id]),
			}));
		},
		[]
	);

	useEffect(() => {
		if (!appID) {
			throw new Error('REACT_APP_AGORA_APP_ID is not set');
		}

		client.join(appID, roomID, token).then(uid => {
			setConnected(true);
			setLocalParticipantUid(uid);
		});

		client.on('user-joined', user => {
			addParticipant(String(user.uid), 'User #' + user.uid);
		});

		client.on('user-published', async (user, mediaType) => {
			if (mediaType === 'audio') {
				await client.subscribe(user, mediaType);

				const audioTrack = user.audioTrack;
				if (!audioTrack) {
					console.warn('User published, but audioTrack is inaccessible');
					return;
				}

				const mediaStreamTrack = audioTrack.getMediaStreamTrack();

				updateParticipant(String(user.uid), participant => ({
					...participant,
					audio: mediaStreamTrack,
				}));
			}
		});

		client.on('user-left', user => {
			removeParticipant(String(user.uid));
		});

		client.on('user-unpublished', async (user, mediaType) => {
			if (mediaType === 'audio') {
				await client.unsubscribe(user, mediaType);

				updateParticipant(String(user.uid), participant => ({
					...participant,
					audio: undefined,
				}));
			}
		});

		return () => {
			setConnected(false);
			setParticipants({});
			client.leave();
		};
	}, [
		addParticipant,
		removeParticipant,
		updateParticipant,
		client,
		roomID,
		token,
	]);

	const value: CallContextProps = useMemo(
		() => ({
			roomID,
			connected,
			participants,
			localParticipantUid,
			localCameraEnabled,
			localAudioEnabled,
			localCameraTrack,
			localAudioTrack,
			setLocalAudioEnabled,
			setLocalCameraEnabled,
		}),
		[
			connected,
			localAudioEnabled,
			localAudioTrack,
			localCameraEnabled,
			localCameraTrack,
			localParticipantUid,
			participants,
			roomID,
			setLocalAudioEnabled,
			setLocalCameraEnabled,
		]
	);

	useDebugValue(value);

	return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
