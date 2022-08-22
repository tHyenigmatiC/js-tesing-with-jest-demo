const fetch = require ('node-fetch');
const swapi = require('./script2');

// # Method 1 of handinling promise calls in tests
// it('calls swapi to get people', (done) => {
// 	expect.assertions(1);
// 	swapi.getPeople(fetch).then(data => {
// 		expect(data.count).toEqual(82);
// 		done();
// 	})
// });


// # Method 2 of handling prmise calls in tests
it('calls swapi api of people', () => {
	expect.assertions(1);
	return swapi.getPeople(fetch).then( data => {
		expect(data.count).toEqual(82);
	})
})

it('calls swapi to get people with promise', (done) => {
	expect.assertions(2);
	swapi.getPeoplePromise(fetch).then(data => {
		expect(data.count).toEqual(82);
		expect(data.results.length).toBeGreaterThan(5);
		done();
	});
});


// instead of waiting for the api to return results which may take longer for
// the larger project. we can mock the api call and return the data so that
// we can check if the function behaves accordingly insted of waiting for the api
// to return the results
// this is done after assuming the API works as intended
it('getPeople returns count and results', () => {

	// mock functions are also called spies
	const mockFetch = jest.fn()
		.mockReturnValue(Promise.resolve({
			json: () => Promise.resolve({
				count: 82,
				results: [0,1,2,3,4,5,6]
			})
		}));

	expect.assertions(4);
	// as we are using depedency injection; we are able pass the fetch function as paramter
	// to getPeoplePromise. Thus, here we can pass as mock function that works similar to fetch
	// and it will work as we want to
	return swapi.getPeoplePromise(mockFetch).then( data => {
		// here we are checking how many times our mock function has been
		expect(mockFetch.mock.calls.length).toBe(1);
		expect(mockFetch).toBeCalledWith('https://swapi.dev/api/people');
		expect(data.count).toEqual(82);
		expect(data.results.length).toBeGreaterThan(5);
	})
})