/*
    Memorial Elementary PTO - Read-A-Thon donation scripts for PayPal integration
    (c) 2017 - Mike Huttinger / Memorial Elementary PTO
*/

var donation = 0.00;

var teacherJSON = {
    "K": [
        "Mumaw",
        "Dombrowski"
    ],
    "1st": [
        "Keller",
        "Hoefler"
    ],
    "2nd": [
        "Coyle",
        "Nellessen"
    ],
    "3rd": [
        "Becker",
        "Watkins"
    ],
    "4th": [
        "Schulte",
        "Martinek"
    ],
    "5th": [
        "Rainey",
        "Spencer"
    ]
};

// Load up the grade/teacher drop-downs from JSON data
$.each(teacherJSON, function(key, value) {
    $('#grade').append($('<option>').text(key).attr('value', key));
    $.each(value, function(i, v) {
        $('#teacher').append($("<option></option>").attr("value", v).text(v));
    });
});

// When a grade is selected, limit the options to those in the JSON list
$('#grade').on('change', function() {
    var grade = $(this).val();
    var teacher = $('#teacher')
    teacher.empty();
    teacher.append('<option value=""></option>');
    if (grade == "") {
        $.each(teacherJSON, function(key, value) {
            $.each(value, function(i, v) {
                teacher.append($("<option></option>").attr("value", v).text(v));
            });
        });
    } else {
        $.each(teacherJSON[grade], function(i, value) {
            teacher.append($("<option></option>").attr("value", value).text(value));
        });
    }
});

// Pre-select values from url:   html?grade=xxx&teacher=xxxx
$("#grade").val(getParameterByName('grade'));
$("#teacher").val(getParameterByName('teacher'));
$("#student").val(getParameterByName('student'));

//This will return a given query string parameter from the current url
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Check if the value is null or empty
function isEmpty(value) {
    if (value == null || value == "") {
        return true;
    }
    return false;
}

// When the variable amount changes, blank out the fixed amount
function updateVariableAmount() {
    if (!isEmpty($("#variableAmount").val())) {
        $("#fixedAmount").val("");
    }
}

// When fixed amount is updated, blank out the variable amount
function updateFixedAmount() {
    if (!isEmpty($("#fixedAmount").val())) {
        $("#variableAmount").val("");
    }
}

// Validate the amount is legit
function validateVariableAmount() {
    var good = true;
    var dollars = $("#variableAmount").val();
    var errorMessage = null;

    if (isEmpty(dollars)) {
        donation = 0.00;
    } else {
        good = $.isNumeric(dollars);
    }

    if (good) {
        donation = Number(dollars).toFixed(2);
        $("#fixedAmount").val("");
        $("#variableAmount").val(donation);
    }

    return good;
}

// Final validation and field buildup.  When done, submit (off to PayPal)
function validate() {
    var good = true;
    var errorText = "";

    if (!isEmpty($("#variableAmount").val())) {
        good = validateVariableAmount();
    } else {
        donation = $("#fixedAmount").val();
    }

    if (donation < 5) {
        errorText += "<li>Minimum donation is $5.00</li>";
        good = false;
    }
    if ($("#student").val() == "") {
        errorText += "<li>Please specify at least a student name.</li>";
        good = false;
    }

    if (good) {
        $("#amount").val(donation);
        $("#os0").val($("#student").val());
        $("#os1").val($("#grade").val());
        $("#os2").val($("#teacher").val());
        $("#item_number").val($("#teacher").val());

        $("#donationForm").submit();
    } else {
        $('#validateErrorMsg').html("<ul>" + errorText + "</ul>");
        $('#validateError').modal();
    }

    return good;
}