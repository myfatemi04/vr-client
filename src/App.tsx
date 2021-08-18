import './App.css';
import AudioCall from './AudioCall';
import Room from './Room';

function App() {
	return (
		<AudioCall roomID='test' token='Token'>
			<Room />
		</AudioCall>
	);
}

export default App;
