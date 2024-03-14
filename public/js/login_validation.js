var $ = require("jquery");

$(document).ready(function () {
    $("#login-form").validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: {
                email: 'Invalid email address'
            }
        }
    })
});
