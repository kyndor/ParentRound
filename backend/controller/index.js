/*
	THIS FILE CONTAINS MAPPING TO ALL THE CONTROLLERS WITHIN OUR CONTROLLER DIRECTORY
	NOTE : MAKE SURE YOU ADD THEM HERE AFTER YOU HAVE CREATED YOUR CONTROLLER
*/
module.exports = {
	users:require('./users-controller.js'),
	schools:require('./schools.js'),
	teacher:require('./teacher.js'),
	parents:require('./parents.js'),
	messages: require('./messages.js'),
	mailmsg: require('./mail.js')
}
