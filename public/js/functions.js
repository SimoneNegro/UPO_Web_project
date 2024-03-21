// function that is used to change password visibility
function togglePasswordVisibility(op) {
    const btn = $(op);
    // take previous input element 
    const txt = btn.prev('input')[0];

    if (btn.text() == "Show") {
        txt.type = "text";
        btn.text("Hide");
    }
    else {
        txt.type = "password";
        btn.text("Show");
    }
}

/*
$("#sign-in-submit").on("submit", function (e) {
    e.preventDefault();
    console.log('your message');
});*/