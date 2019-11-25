const login = require('../../../main/routes/login');
const { expect } = require('../../chai');

describe('Route - Login', () => {

	describe('login', () => {

        
        it('properly stores a cookie', ()=>{
            let next = 0
            let input_req = {
                body: {
                    username: "user",
                    password: "password"
                }
            }
            let actual_output = {}
            let input_res = {
                redirect: function (num, string) {
                    actual_output.redirect = (num, string)
                },
                cookie: function (key, value){
                    actual_output.cookie = (key, value)
                }
            }
            expected_output = ('username', 'user')
            login.loginPost(input_req, input_res, next)

            expect(actual_output.cookie).to.equal(expected_output)
        }) 

		it('with no username or password',  () => {
            
            let next = 0
            let input_req = {
                body: {
                    username: "",
                    password: ""
                }
            }
            let actual_output = {}
            let input_res = {
                redirect: function (num, string) {
                    actual_output.redirect = (num, string)
                },
                cookie: function (key, value){
                    actual_output.cookie = (key, value)
                }
            }
            expected_output = (302, '/login?none')
            login.loginPost(input_req, input_res, next)

            expect(actual_output.redirect).to.equal(expected_output) 
        })
        
        it('with faulty username or password',  () => {

            let next = 0
            let input_req = {
                body: {
                    username: "u",
                    password: "p"
                }
            }
            let actual_output = {}
            let input_res = {
                redirect: function (num, string) {
                    actual_output.redirect = (num, string)
                },
                cookie: function (key, value){
                    actual_output.cookie = (key, value)
                }
            }
            expected_output = (302, '/login?fail')
            login.loginPost(input_req, input_res, next)

            expect(actual_output.redirect).to.equal(expected_output)  
        })

        it('with correct username and password', ()=> {
            let next = 0
            let input_req = {
                body: {
                    username: "user",
                    password: "password"
                }
            }
            let actual_output = {}
            let input_res = {
                redirect: function (num, string) {
                    actual_output.redirect = (num, string)
                },
                cookie: function (key, value){
                    actual_output.cookie = (key, value)
                }
            }
            expected_output = (302, '/course/')
            login.loginPost(input_req, input_res, next)

            expect(actual_output.redirect).to.equal(expected_output) 
        })

	})

})
