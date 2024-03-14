// function that is used to change password visibility
function togglePasswordVisibility(op) {
    var passwordInput;
    var passwordToggle = document.getElementById("show-password-toggle");
    if (op == 0)
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

$("#sign-in-submit").on("submit", function (e) {
    e.preventDefault();
    console.log('your message');
});