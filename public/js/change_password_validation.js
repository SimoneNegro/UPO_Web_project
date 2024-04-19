// verify if email and password have valid values
$(function () {
    $("#change-password").validate({
        // those are rules that field must have to be validated
        rules: {
            password: {
                required: true,
                minlength: 5
            },
            confirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#new-password"
            }
        },

        // those are messages that explain why the fields are not validated
        messages: {
            password: {
                required: 'Please provide a password',
                minlength: 'Password must be at least 5 characters long'
            },
            confirm_password: {
                required: 'Please provide a password',
                minlength: 'Password must be at least 5 characters long',
                equalTo: 'Please enter te same password above'
            }

        },

        // we take the span id to determine where the error message goes in the code
        errorPlacement: function (error, element) {
            var id = element.attr('id');
            var errorElement = $('#' + id + '-error');

            if (errorElement.length)
                error.appendTo(errorElement);
            else
                error.insertAfter(element);
        }
    })
});
