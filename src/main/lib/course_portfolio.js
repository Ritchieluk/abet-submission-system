const Portfolio = require('../models/CoursePortfolio')
const Course = require('../models/Course')
const { transaction } = require('objection');

module.exports.new = async ({
	department_id,
	course_number,
	instructor,
	semester,
	year,
	num_students,
	student_learning_outcomes,
	section
}) => {
	return {
		section: parseInt(section),
		student_learning_outcomes: student_learning_outcomes,
		course_number: parseInt(course_number),
		semester_term_id: parseInt(semester),
		instructor_id: parseInt(instructor),
		year: parseInt(year),
		num_students: parseInt(num_students),
		department_id: parseInt(department_id)
	};
}


module.exports.update = async () => {
	return true;
}

module.exports.save = async (new_portfolio) => {
	let trx;
	try {
		trx = await transaction.start(Portfolio.knex());
		
		var theCourse = await Course.query().findOne('number', '=', new_portfolio.course_number);
		if (!theCourse) {
			theCourse = await Course.query().insert({
				number: new_portfolio.course_number,
				department_id: new_portfolio.department_id
			});
			
		}
		const savedPortfolio = await Portfolio.query().insert({
			section: new_portfolio.section,
			course_id: theCourse.id,
			semester_term_id: new_portfolio.semester_term_id,
			instructor_id: new_portfolio.instructor_id,
			year: new_portfolio.year,
			num_students: new_portfolio.num_students,
			archived: false
		});

		await trx.commit();

		return savedPortfolio.id;
	} catch (err) {
		console.log(err);
		await trx.rollback();
		return -1;
	}
}


module.exports.get = async (portfolio_id) => {
	let raw_portfolio = await Portfolio.query()
		.eager({
			course: {
				department: true
			},
			instructor: true,
			semester: true,
			outcomes: {
				slo: {
					metrics: true
				},
				artifacts: {
					evaluations: true
				}
			}
		})
		.findById(portfolio_id)

	let portfolio = {
		portfolio_id: raw_portfolio.id,
		course_id: raw_portfolio.course_id,
		instructor: raw_portfolio.instructor,
		num_students: raw_portfolio.num_students,
		outcomes: [],
		course: {
			department: raw_portfolio.course.department.identifier,
			number: raw_portfolio.course.number,
			section: raw_portfolio.section,
			semester: raw_portfolio.semester.value,
			year: raw_portfolio.year
		},
	}

	for (let i in raw_portfolio.outcomes) {
		portfolio.outcomes.push(Object.assign({
			artifacts: raw_portfolio.outcomes[i].artifacts
		}, raw_portfolio.outcomes[i].slo))
	}

	return portfolio
}