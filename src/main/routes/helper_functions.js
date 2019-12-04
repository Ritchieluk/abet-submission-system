const { transaction } = require('objection')
var mustache = require('../common/mustache')
const Department = require('../models/Department')
const TermType = require('../models/TermType')
const Portfolio = require('../models/CoursePortfolio')
const Course = require('../models/Course')
const Artifact = require('../models/CoursePortfolio/Artifact')

async function constructPortfolios(bool){
    courses = ""
    let trx
		try {
			trx = await transaction.start(Portfolio.knex());

			let portfolios = await Portfolio.query().eager('semester').where("archived", "=", bool)
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
                if(bool){
                    archived_courses_html = mustache.render('course/course_archive',{
                        ID: courseID,
                        semester: portfolio['semester']['value'],
                        year: portfolio['year'],
                        artifact_progress: art_progress,
                        date: date,
                        location: portfolio['id']
                    })
                    courses += archived_courses_html
                } else {
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
				
			}
            await trx.commit();
            return courses
		} catch (err) {
			console.log(err);
			await trx.rollback();
			return -1;
		}
}
module.exports = constructPortfolios