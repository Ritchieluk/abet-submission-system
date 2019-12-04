const constructPortfolios = require('../../../main/routes/helper_functions');
const { expect } = require('../../chai');

const sinon = require('sinon')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

describe('Route - course get /', () => {

	describe('constructPortfolios', () => {

        it('')

	})

})

describe('Route - Archived', () => {
	describe('archive a portfolio', () => {
		// Arrange
		const CoursePortfolio = require('../../../main/models/CoursePortfolio')

		portfolio = {
				"id": 1,
				"archived": false,
				"course_id": 1,
				"instructor_id": 1,
				"semester_term_id": 1,
				"num_students": 5,
				"section": 1,
				"year": 2019,
				"course": {
					"id": 1,
					"department_id": 1,
					"number": 498,
					"department": {
						"id": 1,
						"identifier": "cs",
						"name": "Computer Science"
					}
				},
				"instructor": {
					"id": 1,
					"linkblue_username": "user"
				},
				"semester": {
					"id": 1,
					"type": 1,
					"value": "fall"
				},
				"outcomes": [
					{
						"id": 1,
						"portfolio_id": 1,
						"slo_id": 1,
						"slo": {
							"id": 1,
							"department_id": 1,
							"index": 2,
							"description": "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
							"metrics": [
								{
									"id": 1,
									"slo_id": 1,
									"index": 1,
									"name": "Identify and interpret client needs and design constraints",
									"exceeds": "n/a",
									"meets": "n/a",
									"partially": "n/a",
									"not": "n/a"
								}
							]
						},
						"artifacts": [
							{
								"id": 1,
								"portfolio_slo_id": 1,
								"index": 1,
								"name": "_unset_",
								"evaluations": [
									{
										"id": 1,
										"artifact_id": 1,
										"evaluation_index": 1,
										"student_index": 1,
										"evaluation": [],
										"file": null
									}
								]
							},
							{
								"id": 2,
								"portfolio_slo_id": 1,
								"index": 2,
								"name": "_unset_",
								"evaluations": [
									{
										"id": 6,
										"artifact_id": 2,
										"evaluation_index": 1,
										"student_index": 1,
										"evaluation": [],
										"file": null
									}
								]
							},
							{
								"id": 3,
								"portfolio_slo_id": 1,
								"index": 3,
								"name": "_unset_",
								"evaluations": [
									{
										"id": 11,
										"artifact_id": 3,
										"evaluation_index": 1,
										"student_index": 1,
										"evaluation": [],
										"file": null
									}
								]
							}
						]
					}
				]
			}

			expect(portfolio.archived).to.equal(false);
	})

});