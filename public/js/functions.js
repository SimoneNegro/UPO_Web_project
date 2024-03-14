// function that is used to change password visibility
function togglePasswordVisibility(op) {
    var passwordInput;
    var passwordToggle = document.getElementById("show-password-toggle");
    if(op == 0)
        passwordInput = document.getElementById("current-password");
    else
        passwordInput = document.getElementById("new-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggle.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        passwordToggle.textContent = "Show";
    }
}


function validateLoginForm() {
    var mail = document.getElementById("email");
    alert(validateMail(mail));
}

function validateSignupForm() {
    
}

function validateMail(mail) {
    return mail.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) !== null; 
}