import './App.css';
import SpaceHost from './SpaceHost';

function App() {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				height: '100vh',
			}}
		>
			<h1 style={{ color: 'white' }}>Silicon Valley</h1>
			<SpaceHost />
		</div>
	);

	// return (
	// 	<AudioCall roomID='test' token='Token'>
	// 		<AudioCallUI />
	// 	</AudioCall>
	// );
}

export default App;
