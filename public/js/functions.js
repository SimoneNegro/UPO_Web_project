// function that is used to change password visibility
/**
 * Show or hide password field.
 * @param {*} op
 */
function togglePasswordVisibility(op) {
    const btn = $(op);
    // take previous input element 
    const txt = btn.prev('input')[0];

    if (btn.text() == "Show") {
        txt.type = "text";
        btn.text("Hide");
    } else {
        txt.type = "password";
        btn.text("Show");
    }
}

// show textarea length
$(() => {
    const messageEle = $('#description');
    const counterEle = $('#counter');
    const maxLength = messageEle.attr('maxlength');

    counterEle.text(`0/${maxLength}`);

    messageEle.on('input', function (e) {
        const target = e.target;

        // Count the current number of characters
        const currentLength = target.value.length;

        counterEle.text(`${currentLength}/${maxLength}`);
    });
});


// document.addEventListener('DOMContentLoaded', function () {
//     const messageEle = document.getElementById('message');
//     const counterEle = document.getElementById('counter');
//     const maxLength = messageEle.getAttribute('maxlength');

//     counterEle.innerHTML = '0/' + maxLength;

//     messageEle.addEventListener('input', function (e) {
//         const target = e.target;
//         const currentLength = target.value.length;
//         counterEle.innerHTML = currentLength + '/' + maxLength;
//     });
// });

/*
$("#sign-in-submit").on("submit", function (e) {
    e.preventDefault();
    console.log('your message');
});*/