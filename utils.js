const path = (p, o) => {
	const reducerFunction = (xs, x) => {
		return xs && xs[x] ? xs[x] : null;
	};
	return p.reduce(reducerFunction, o);
};

module.exports = {
	path,
};
