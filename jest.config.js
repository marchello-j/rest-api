/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRegex: '.e2e.tests.ts$'
}

// testRegex: '.e2e.tests.ts$', //<-- чтобы запускались только файлы с расширением ".e2e.test.ts"
