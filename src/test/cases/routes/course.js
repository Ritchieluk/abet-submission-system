const constructPortfolios = require('../../../main/routes/helper_functions');
const { expect } = require('../../chai');
const Portfolio = require('C:/Users/ritch/Documents/CSFall2019/abet-submission-system-1/src/main/models/CoursePortfolio')
const sinon = require('sinon')
var mustache = require('C:/Users/ritch/Documents/CSFall2019/abet-submission-system-1/src/main/common/mustache.js')


const sandbox = sinon.createSandbox();

describe('Route - course get /', () => {

	describe('constructPortfolios', () => {
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
		})
		it('returns active data when false is input', async ()=>{
			let input = false
			let expected_output_num = await Portfolio.query().count('*').where('archived', '=', input)
			let expected_output = ""
			for (let i = 0; i < expected_output_num[0].count; i++){
				expected_output += '1'
			}
			// mock mustache rendering
			sandbox.stub(mustache, "render").returns(1)

			let actual_output = await constructPortfolios(input)
			expect(expected_output).to.equal(actual_output)
		})
			

		it('returns archived data when true is input', async ()=>{
			let input = true
			let expected_output_num = await Portfolio.query().count('*').where('archived', '=', input)
			let expected_output = ""
			for (let i = 0; i < expected_output_num[0].count; i++){
				expected_output += '1'
			}
			// mock mustache rendering
			sandbox.stub(mustache, "render").returns(1)

			let actual_output = await constructPortfolios(input)
			expect(expected_output).to.equal(actual_output)
		})

	})

})