import * as ws from "../../js/ws.js";

//check if theres a url variable "erre" then cala error with the message if true
var r = true;
var l = true;
const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get("error");
if (error) {
    err({
        title: "Error",
        text: error,
    });
}

//event listeners
$("#signup").click(signupHandler);
//enter key triggers signup
$(document).keypress((e) => {
    if (e.which == 13) signupHandler();
});

async function signupHandler() {
    const data = await signup();
    if (data) ws.loader(10, 10);
}

$("#test").click(() => test());

function test() {
    const randomValue = () => Math.random();
    $("#email").val(`test${randomValue().toFixed(3)*1000}@hsestudents.org`);
    $("#password, #password_confirm").val("password");
    $("#first_name").val(`first${randomValue()}`);
    $("#last_name").val(`last${randomValue()}`);
    //six digit number
    $("#student_id").val(Math.floor(100000 + Math.random() * 900000));
    signup();
}

//studnet id if at 6 digits prevent more input
$("#student_id").on("input", function () {
    if ($("#student_id").val().length > 6) {
        $("#student_id").val($("#student_id").val().slice(0, 6));
    }
});

async function signup() {
    ws.loader(10, 1);
    const email = $("#email").val();
    const password = $("#password").val();
    const confirmPassword = $("#password_confirm").val();
    const fName = $("#first_name").val();
    const lName = $("#last_name").val();
    const sId = $("#student_id").val();

    const validationErrors = [
        {
            condition: !email.includes("@") || !email.includes(".") || email.includes(' ') || !email.endsWith('@hsestudents.org'),
            title: "Invalid Email",
            text: "Please enter a valid email",
        },
        {
            condition: email.length > 50,
            title: "Email too long",
            text: "Please enter an email with at most 50 characters",
        },
        {
            condition: sId.includes(" "),
            title: "Student ID contains spaces",
            text: "Please enter a student ID without spaces",
        },
        {
            condition: fName.includes(" ") || lName.includes(" "),
            title: "Name contains spaces",
            text: "Please enter a name without spaces",
        },
        {
            condition: password.length < 8,
            title: "Password too short",
            text: "Please enter a password with at least 8 characters",
        },
        {
            condition: password.length > 20,
            title: "Password too long",
            text: "Please enter a password with at most 20 characters",
        },
        {
            condition: password.includes(" "),
            title: "Password contains spaces",
            text: "Please enter a password without spaces",
        },
        {
            condition: password !== confirmPassword,
            title: "Passwords do not match",
            text: "Please make sure your passwords match",
        },
        {
            condition:
                !email ||
                !password ||
                !confirmPassword ||
                !fName ||
                !lName ||
                !sId,
            title: "Empty Fields",
            text: "Please fill out all fields",
        },
    ];

    for (const error of validationErrors) {
        if (error.condition) {
            err({ title: error.title, text: error.text });
            return "pass";
        }
    }

    try {
        const res = await ws.signup({
            email,
            password,
            name: `${fName} ${lName}`,
            studentID: sId,
        });
        if (res.title.toLowerCase() === "success") {
            err({ status: "success", title: res.title, text: res.message });
            return true;
        }else{
            err({ title: res.title, text: res.message });
            return 'pass';
        }
    } catch (error) {
        console.error("Error during signup:", error);
        err({ title: "Error", text: "Error during signup" });
        return "pass";
    }
}

function err(msg) {
    //console.log(msg);
    let title = msg.title;
    let text = msg.text;
    let status = "error";
    if (msg.status) {
        status = 'success';
    } else {
        status = "error";
    }

    new Notify({
        status: status,
        title: title,
        text: text,
        effect: "slide",
        speed: 300,
        customClass: "",
        customIcon: "",
        showIcon: true,
        showCloseButton: false,
        autoclose: true,
        autotimeout: 3500,
        notificationsGap: 0,
        notificationsPadding: 0,
        type: "outline",
        position: "right top",
        customWrapper: "",
    });
}
