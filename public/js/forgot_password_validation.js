// verify if email and password have valid values
$(document).ready(function () {
    $("#forgot-password").validate({
        // those are rules that field must have to be validated
        rules: {
            email: {
                required: true,
                email: true
            }
        },

        // those are messages that explain why the fields are not validated
        messages: {
            email: {
                email: 'Invalid email address'
            }
        },
    })
});
