'use strict'

function getLength(buffer) {
	if (typeof('buffer') === 'string') return buffer.length;
	if (buffer instanceof Buffer) return buffer.byteLength;
	throw new Error("Unknown type!");
}

export default function write(stream, buffer) {
	const length = getLength(buffer);

	return new Promise((resolve, reject) => {
		if (Array.isArray(stream)) {
			stream.push(Buffer.from(buffer));
			// avoid zalgo
			setTimeout(() => { resolve(length); }, 0);
		} else {
			let ok = true;
			ok = stream.write(buffer);
			if (ok) {
				resolve(length);
			} else {
				stream.once('drain', resolve.bind(null, length));
			}
		}
	});
}
