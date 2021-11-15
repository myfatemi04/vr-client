import { useEffect, useState } from 'react';

export default function useSmooth(value: number) {
	const [smooth, setSmooth] = useState(value);
	useEffect(() => {
		const interval = setInterval(() => {
			setSmooth(smooth => smooth * 0.8 + value * 0.2);
		}, 1000 / 60);
		return () => clearInterval(interval);
	}, [value]);
	return smooth;
}
