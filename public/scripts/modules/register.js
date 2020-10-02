"use strict";
import { landingPage } from './landing.js';
import { loginPageConstruction } from './login.js';

let registerPageConstruction = {
    loadPage: function () {
        this.clearPage();
        this.setActiveNav();
        let main = $("#mainContent");
        main.addClass("inner cover");
        main.append(this.createForm());
        main.append(this.createModal());
    },
    createForm: function () {
        let form = $("<form>", { class: "form-signin", method: "post", id: "registerForm" });
        form.on("submit", function (event) {
            event.preventDefault();
            if (formValidation.username() && formValidation.password()) {
                $.post({
                    url: "api/users",
                    data: {
                        "username": $("#createUsername").val(),
                        "password": $("#createPassword").val()
                    }
                })
                    // User data has been stored, remove register page and go to login page
                    .done(function (data) {
                        $("#successModal").modal("show");
                    })
                    .fail(function (xhr, status, error) {
                        $("#mainContent").append($("<p>", { class: "text-danger", text: "Username already exists" }));
                    });
            }
            else {
                $("#mainContent").append($("<p>", { class: "text-danger", text: "Passwords do not match" }));
                return false;
            }
        });

        form.append(this.createLogos());
        form.append(this.createUsernameInput());
        form.append(this.createPasswordInput());
        form.append(this.createConfirmPasswordInput());
        form.append(this.createButtons());

        return form;
    },
    createLogos: function () {
        // Create all elements for displaying logo with link back to landing page
        let container = $("<div>", { class: "text-center mb-4" });
        let link = $("<a>", { class: "logo-form-master" });
        link.on("click", function () {
            landingPage.loadPage();
        });
        let logo = $("<img>", { class: "mb-4 logo-form logo-link", src: "images/logo.png", alt: "logo-link-to-home" });
        let logo100px = $("<img>", { class: "logo-100px logo-link", src: "images/logo-100px.png", alt: "logo-100px-link-to-home" });

        container.append(link);
        link.append(logo);
        link.append(logo100px);

        return container;
    },
    createUsernameInput: function () {
        let container = $("<div>", { class: "form-label-group" });
        let input = $("<input>", { type: "text", id: "createUsername", class: "form-control", name: "username", placeholder: "Create a Username", required: "required", autofocus: "autofocus" });
        let label = $("<label>", { for: "createUsername", text: "Create a Username" });

        container.append(input);
        container.append(label);

        return container;
    },
    createPasswordInput: function () {
        let container = $("<div>", { class: "form-label-group" });
        let input = $("<input>", { type: "password", id: "createPassword", name: "password", class: "form-control", placeholder: "Password", required: "required" });
        let label = $("<label>", { for: "createPassword", text: "Password" });

        container.append(input);
        container.append(label);

        return container;
    },
    createConfirmPasswordInput: function () {
        let container = $("<div>", { class: "form-label-group" });
        let input = $("<input>", { type: "password", id: "confirmPassword", class: "form-control", placeholder: "Confirm Password", required: "required" });
        let label = $("<label>", { for: "confirmPassword", text: "Confirm Password" });

        container.append(input);
        container.append(label);

        return container;
    },
    createButtons: function () {
        let container = $("<div>");
        let signIn = $("<button>", { class: "btn btn-dark btn-block", id: "registerBtn", type: "submit", text: "Register" });
        let cancel = $("<button>", { class: "btn btn-dark btn-block", type: "reset", text: "Cancel" });
        cancel.on("click", function () {
            registerPageConstruction.loadPage();
        });

        container.append(signIn);
        container.append(cancel);

        return container;
    },
    createModal: function () {
        let modal = $("<div>", { class: "modal", tabindex: "-1", id: "successModal" });
        let modalDialog = $("<div>", { class: "modal-dialog modal-dialog-centered" });
        let modalContent = $("<div>", { class: "modal-content" });
        let modalHeader = $("<div>", { class: "modal-header" });
        let modalTitle = $("<h5>", { class: "modal-title", text: "Registered!" });
        let xButton = $("<button>", { type: "button", class: "close", dataDismiss: "modal", ariaLabel: "Close" });
        let xSpan = $("<span>", { ariaHidden: "true", html: "&times;" });
        xSpan.on("click", function () {
            $("#successModal").modal("hide");
            loginPageConstruction.loadPage();
        });
        let modalBody = $("<div>", { class: "modal-body" });
        let modalText = $("<p>", { text: "Succesfully registered, please log in" });
        let modalFooter = $("<div>", { class: "modal-footer" });
        let button = $("<button>", { type: "button", class: "btn btn-info", dataDismiss: "modal", ariaLabel: "Close", text: "Sign in" });
        button.on("click", function () {
            $("#successModal").modal("hide");
            loginPageConstruction.loadPage();
        });

        modal.append(modalDialog);
        modalDialog.append(modalContent);
        modalContent.append(modalHeader);
        modalHeader.append(modalTitle);
        modalHeader.append(xButton);
        xButton.append(xSpan);
        modalContent.append(modalBody);
        modalBody.append(modalText);
        modalContent.append(modalFooter);
        modalFooter.append(button);

        return modal;
    },
    clearPage: function () {
        $("#mainContent").empty();
    },
    setActiveNav: function () {
        $("#homeNavLink").removeClass("active");
        $("#loginNavLink").removeClass("active");
        $("#registerNavLink").addClass("nav-link active");
        $("#aboutNavLink").removeClass("active");
    }
};

let formValidation = {
    username: function () {
        let username = $("#createUsername").val();
        if (username.length != 0) {
            return true;
        }
        else {
            return false;
        }
    },
    password: function () {
        let password1 = $("#createPassword").val();
        let password2 = $("#confirmPassword").val();

        if (password1 === password2) {
            return true;
        }
        else {
            return false;
        }
    }
};

export { registerPageConstruction };