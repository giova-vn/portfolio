
$(document).ready(function() {
    //validation for studio page
    $("#studioForm").validate({
        errorClass: "error_mesg",
        errorElement: "p", 

        rules: {
            clientName: {
                required: true,
                minlength: 2
            },
            clientEmail: {
                required: true,
                email: true 
            },
            clientNumber: {
                required: true,
                digits: true, 
                minlength: 10, 
                maxlength: 10 
            },
            preferredMethod: { 
                required: true
            },
            clientComment: {
                required: false, 
                minlength: 5
            }
        },

    
        messages: {
            clientName: {
                required: "Enter full name.",
                minlength: "Your name must be at least 2 characters long."
            },
            clientEmail: {
                required: "Enter your email.",
                email: "Enter a valid email."
            },
            clientNumber: {
                required: "Enter your phone number.",
                digits: "Enter only numbers.",
                minlength: "Your phone number must be 10 numbers long.",
                maxlength: "Your phone number must be 10 numbers long."
            },
            preferredMethod: {
                required: "Select your preferred method of contact."
            },
            clientComment: {
                minlength: "Comment must be at least 5 characters long."
            }
        },


        highlight: function(element, errorClass, validClass) {
            $(element).addClass('input_error').removeClass(validClass);
            if ($(element).is(':radio')) {
                $(element).closest('.radio_buttons').addClass('group_error');
            }
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass('input_error').addClass(validClass);
            if ($(element).is(':radio')) {
                $(element).closest('.radio_buttons').removeClass('group_error');
            }
        },

        errorPlacement: function(error, element) {
            error.addClass('error_mesg');
            if (element.is(':radio')) {
                error.insertAfter(element.closest('.radio_buttons'));
            } 
            else if (element.attr("name") == "clientNumber") {
                error.insertAfter(element.closest('.center'));
            }
            else {
                error.insertAfter(element);
            }
        },

        //checker
        submitHandler: function(form) {
            alert("Form submitted");
            form.reset();
        }
    });

    //validation for contact page
    if ($("#contactForm").length) { 
        $("#contactForm").validate({
            errorClass: "error_mesg", 
            errorElement: "p",       

            rules: {
                customerFirstName: {
                     required: true, 
                     minlength: 2 
                },
                customerLastName: {
                    required: true, 
                    minlength: 2 
                },
                customerEmail: { 
                    required: true, 
                    email: true 
                },
                customerPhone: { 
                    required: true, 
                    digits: true, 
                    minlength: 7, 
                    maxlength: 15 
                },
                customerTypeService: { 
                    required: true, 
                    minlength: 4
                },
                customerRole: { 
                    required: true 
                }, 
                customerDesiredDate: { 
                    required: true, 
                    date: true 
                },
                contactPreferredMethod: { 
                    required: true 
                },
                clientTime: { 
                    required: true 
                },     
                customerMessage: { 
                    required: true, 
                    minlength: 10 
                }
            },

            messages: {
                customerFirstName: {
                    required: "Enter your first name.",
                    minlength: "First name must be at least 2 characters."
                },
                customerLastName: {
                    required: "Enter your last name.",
                    minlength: "Last name must be at least 2 characters."
                },
                customerEmail: {
                    required: "Enter your email.",
                    email: "Enter a valid email address."
                },
                customerPhone: {
                    required: "Enter your phone number.",
                    digits: "Enter only numbers for phone.",
                    minlength: "Phone number seems too short.",
                    maxlength: "Phone number seems too long."
                },
                customerTypeService: {
                    required: "Specify the type of photography needed.",
                    minlength: "Description must be at least 4 characters."
                },
                customerRole: "Select your role.",
                customerDesiredDate: {
                    required: "Select the event date.",
                    date: "Enter a valid date."
                },
                contactPreferredMethod: "Select your preferred contact method.",
                clientTime: "Select the best time to contact you.",
                customerMessage: {
                    required: "Enter your message.",
                    minlength: "Message must be at least 10 characters."
                }
            },

            highlight: function(element, errorClass, validClass) {
                $(element).addClass('input_error').removeClass(validClass); 
                if ($(element).attr('name') === 'contactPreferredMethod') {
                    $(element).closest('.radio_container').addClass('group_error');
                }
            },

            unhighlight: function(element, errorClass, validClass) {
                $(element).removeClass('input_error').addClass(validClass);
                if ($(element).attr('name') === 'contactPreferredMethod') {
                    $(element).closest('.radio_container').removeClass('group_error');
                }
            },

            errorPlacement: function(error, element) {
                error.addClass('error_mesg');
                if (element.attr('name') === 'contactPreferredMethod') {
                    error.insertAfter(element.closest('.radio_container'));
                } 
                else if (element.attr("name") == "customerPhone") {
                    error.insertAfter(element.closest('.phone_group'));
                }
                else {
                    error.insertAfter(element);
                }
            },

            //checker
            submitHandler: function(form) {
                alert("Form submitted");
                form.reset();
            }
        });
    }

    //validation for log in page
    if ($("#loginForm").length) { 
        $("#loginForm").validate({
            errorClass: "error_mesg", 
            errorElement: "p",

            rules: {
                clientUsername: {
                    required: true,
                    minlength: 3
                },
                clientPassword: {
                    required: true,
                    minlength: 6 
                }
            },

            messages: {
                clientUsername: {
                    required: "Enter your username.",
                    minlength: "Username must be at least 3 characters long."
                },
                clientPassword: {
                    required: "Enter your password.",
                    minlength: "Password must be at least 6 characters long."
                }
            },

            highlight: function(element, errorClass, validClass) {
                $(element).addClass('input_error').removeClass(validClass);
            },

            unhighlight: function(element, errorClass, validClass) {
                $(element).removeClass('input_error').addClass(validClass);
            },

            errorPlacement: function(error, element) {
                error.addClass('error_mesg');
                error.insertAfter(element);
            },
        });
    }
});