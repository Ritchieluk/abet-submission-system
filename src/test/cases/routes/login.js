const login = require('../../../../main/routes/login');
const { expect } = require('../../../chai');
const sinon = require('sinon')

const sandbox = sinon.createSandbox()

describe('Route - Login', () => {

	describe('login', () => {

        afterEach(()=>{
            sandbox.restore()
        })

		it('with no username or password',  () => {
            
            sandbox.stub(login, 'res.redirect').returns()

            let input_req, input_res, next
            input_req.body.username = ""
            input_req.body.password = ""

            expected_res_input = (302, '/login?none')
            login.loginPost(input_req, input_res, next)

            expect(login.res.redirect.calledOnceWithExactly(expected_res_input)).to.be.true 
        })
        
        it('with faulty username or password',  () => {
            sandbox.stub(login, 'res.redirect').returns()

            let input_req, input_res, next
            input_req.body.username = 'user1'
            input_req.body.password = 'incorrectpassword'

            expected_res_input = (302, '/login?fail')
            login.loginPost(input_req, input_res, next)

            expect(login.res.redirect.calledOnceWithExactly(expected_res_input)).to.be.true 
        })

        it('with correct username and password', ()=> {
            sandbox.stub(login, 'res.redirect').returns()

            let input_req, input_res, next
            input_req.body.username = 'user'
            input_req.body.password = 'password'

            expected_res_input = (302, '/course/')
            login.loginPost(input_req, input_res, next)

            expect(login.res.redirect.calledOnceWithExactly(expected_res_input)).to.be.true 
        })

	})

})
