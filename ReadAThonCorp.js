/*
    Memorial Elementary PTO - Read-A-Thon donation scripts for PayPal integration
    (c) 2017 - Mike Huttinger / Memorial Elementary PTO
*/

var donation = 0.00;

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
    if ($("#company").val() == "") {
        errorText += "<li>Please specify your company name.</li>";
        good = false;
    }

    if (good) {
        $("#amount").val(donation);
        $("#os0").val($("#company").val());

        $("#donationForm").submit();
    } else {
        $('#validateErrorMsg').html("<ul>" + errorText + "</ul>");
        $('#validateError').modal();
    }

    return good;
}