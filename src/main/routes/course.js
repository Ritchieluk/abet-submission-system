var express = require('express');
var mustache = require('../common/mustache')
var html = require('../common/html')
var course_portfolio_lib = require('../lib/course_portfolio')
var router = express.Router();
var cookieParser = require('cookie-parser')
const { transaction } = require('objection')

const Department = require('../models/Department')
const TermType = require('../models/TermType')
const Portfolio = require('../models/CoursePortfolio')
const Course = require('../models/Course')
const Artifact = require('../models/CoursePortfolio/Artifact')

const course_manage_page = async (res, course_id) => {
	let course_info = {
		student_learning_outcomes: [
			{
				index: 1,
				description: 'n/a',
				metrics: [
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
				],
				artifacts: [
					{
						name: 'n/a',
						evaluations: [
							{
								index: 1,
								evaluation: [
									{
										metric: 1,
										value: 6
									},
									{
										metric: 2,
										value: 6
									},
									{
										metric: 3,
										value: 6
									},
									{
										metric: 4,
										value: 6
									}
								]
							}
						]
					}
				]
			}
		]
	};

	res.render('base_template', {
		title: 'CS498 Course Portfolio',
		body: mustache.render('course/manage', course_info)
	})
}

const course_new_page = async (res, department = false) => {
	const departments = await Department.query().select()
	const semesters = await (await TermType.query()
		.findById('semester'))
		.$relatedQuery('terms')
	let student_learning_outcomes = false

	if (department) {
		student_learning_outcomes = await (await Department.query().findById(department))
			.$relatedQuery('student_learning_outcomes')
	}

	res.render('base_template', {
		title: 'New Course Portfolio',
		body: mustache.render('course/new', {
			departments,
			department,
			student_learning_outcomes,
			semesters
		})
	})
}

router.get('/archive/:id', function (req, res, next) {archivePortfolio(req, res, req.params.id)})
async function archivePortfolio(req, res, id) {
	const numUpdated = await Portfolio.query()
		.findOne('id', '=', id)
		.patch({archived: true});
	res.redirect(302, '/course/' + id)
}

/* GET course home page */
router.route('/')
	.get(html.auth_wrapper(async (req, res, next) => {
		let courses = ""
		let trx
		try {
			trx = await transaction.start(Portfolio.knex());

			let portfolios = await Portfolio.query().eager('semester').where("archived", "=", false)
			for (portfolio of portfolios)  {
				let course = await Course.query().findOne('id', '=', portfolio['course_id'])
				let department = await Department.query().findOne('id', '=', course['department_id'])
				courseID = String(department['identifier'])+course['number']
				
				let plo = await Portfolio.query().eager('outcomes').findOne('id', '=', portfolio['id'])
				let artifactCount = await Artifact.query().where("portfolio_slo_id", "=", plo['id']).count('*')
				let eval_num = parseInt(portfolio['num_students'] / 10) > 10   ?  10 : parseInt(portfolio['num_students']/10)
				let art_progress = artifactCount[0]['count'] + '/' + eval_num

				let date = new Date(Date.now() + 12096e5)
				var month = date.getMonth() + 1
				var day = date.getDate()
				var year = date.getFullYear()
				date = month + "/" + day + "/" + year
				active_courses_html = mustache.render('course/course_row',{
					ID: courseID,
					semester: portfolio['semester']['value'],
					year: portfolio['year'],
					artifact_progress: art_progress,
					date: date,
					location: portfolio['id']
				})
				courses += active_courses_html
			}
			await trx.commit();
		} catch (err) {
			console.log(err);
			await trx.rollback();
			return -1;
		}
		
		let archived_courses = ""
		try {
			trx = await transaction.start(Portfolio.knex());

			let portfolios = await Portfolio.query().eager('semester').where("archived", "=", true)
			for (portfolio of portfolios)  {
				let course = await Course.query().findOne('id', '=', portfolio['course_id'])
				let department = await Department.query().findOne('id', '=', course['department_id'])
				courseID = String(department['identifier'])+course['number']
				
				let plo = await Portfolio.query().eager('outcomes').findOne('id', '=', portfolio['id'])
				let artifactCount = await Artifact.query().where("portfolio_slo_id", "=", plo['id']).count('*')
				let eval_num = parseInt(portfolio['num_students'] / 10) > 10   ?  10 : parseInt(portfolio['num_students']/10)
				let art_progress = artifactCount[0]['count'] + '/' + eval_num
				
				let date = new Date(Date.now() + 12096e5)
				var month = date.getMonth() + 1
				var day = date.getDate()
				var year = date.getFullYear()
				date = month + "/" + day + "/" + year
				active_courses_html = mustache.render('course/course_archive',{
					ID: courseID,
					semester: portfolio['semester']['value'],
					year: portfolio['year'],
					artifact_progress: art_progress,
					date: date,
					location: portfolio['id']
				})
				archived_courses += active_courses_html
			}
			await trx.commit();
		} catch (err) {
			console.log(err);
			await trx.rollback();
			return -1;
		}
		console.log(archived_courses)
		res.render('base_template', {
			title: 'Course Portfolios',
			body: mustache.render('course/index', {
				active_courses: courses,
				archived_courses: archived_courses
			}),
			login_header: `<header class="row container">
			<h3 id="user">Hello, ${req.cookies.username}</h3>
		</header>`
			})
	}))

/* GET course page */
router.route('/:id')
	.get(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			await course_new_page(res)
		} else {
			await course_manage_page(res, req.params.id)
		}
	}))
	.post(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			if (req.body.course_submit) {
				const course_portfolio = await course_portfolio_lib.new({
					department_id: req.body.department,
					course_number: req.body.course_number,
					instructor: 1,
					semester: req.body.semester,
					year: req.body.course_year,
					num_students: req.body.num_students,
					student_learning_outcomes: Object.entries(req.body)
						.filter(entry => entry[0].startsWith('slo_') && entry[1] === 'on')
						.map(entry => entry[0].split('_')[1]),
					section: req.body.course_section
				})

				const id = await course_portfolio_lib.save(course_portfolio);

				if (id != -1) {
					res.redirect(302, `/course/${id}`);
				}
			} else {
				await course_new_page(res, req.body.department)
			}
		} else {
			await course_manage_page(res, 499)
		}
	}))

module.exports = router;
