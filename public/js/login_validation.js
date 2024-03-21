// verify if email and password have valid values
$(function () {
    $("#login-form").validate({
        // those are rules that field must have to be validated
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            }
        },

        // those are messages that explain why the fields are not validated
        messages: {
            email: {
                email: 'Invalid email address'
            },
            password: {
                required: 'Please provide a password',
                minlength: 'Password must be at least 5 characters long'
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
