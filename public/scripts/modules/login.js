"use strict";
import { landingPage } from './landing.js';
import { recipePageConstruction } from './recipes.js';

let loginPageConstruction = {
    loadPage: function () {
        // Check if user is already logged in, if yes bypass login page and redirect user to content
        if (localStorage.authenticated == "YES") {
            recipePageConstruction.loadPage(localStorage.userType);
        }
        else if (sessionStorage.authenticated == "YES") {
            recipePageConstruction.loadPage(sessionStorage.userType);
        }
        else {
            this.clearPage();
            this.setActiveNav();
            let main = $("#mainContent");
            main.addClass("inner cover");
            main.append(this.createForm());
        }
    },
    createForm: function () {
        let form = $("<form>", { class: "form-signin", id: "loginForm" });
        form.on("submit", function (event) {
            event.preventDefault();
            let rememberUser = $("#remember");
            $.post({
                url: "api/login",
                data: {
                    "username": $("#inputUsername").val(),
                    "password": $("#inputPassword").val()
                }
            })
                .done(function (data) {
                    // Allow user to bypass the login screen for future visits
                    sessionStorage.authenticated = "YES";
                    sessionStorage.userType = data.data.type;
                    if (rememberUser.is(":checked")) {
                        localStorage.authenticated = "YES";
                        localStorage.userType = data.data.type;
                    }
                    else {
                        localStorage.removeItem("authenticated");
                        localStorage.removeItem("userType");
                    }

                    loginStatus.checkLocalStorage(data.data.type);

                })
                .fail(function (xhr, status, error) {
                    // if login failed remove any saved data
                    if (sessionStorage.authenticated) {
                        localStorage.removeItem("authenticated");
                        sessionStorage.removeItem("authenticated");
                    }
                    if (sessionStorage.userType) {
                        localStorage.removeItem("userType");
                        sessionStorage.removeItem("userType");
                    }
                    let errorMessage = xhr.status + ": " + xhr.statusText;
                    console.log(errorMessage);
                });
            return false;
        });

        form.append(this.createLogos());
        form.append(this.createUsernameInput());
        form.append(this.createPasswordInput());
        form.append(this.createCheckbox());
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
        let input = $("<input>", { type: "text", id: "inputUsername", class: "form-control", name: "username", placeholder: "Username", required: "required", autofocus: "autofocus" });
        let label = $("<label>", { for: "inputUsername", text: "Username" });

        container.append(input);
        container.append(label);

        return container;
    },
    createPasswordInput: function () {
        let container = $("<div>", { class: "form-label-group" });
        let input = $("<input>", { type: "password", id: "inputPassword", class: "form-control", name: "password", placeholder: "Password", required: "required" });
        let label = $("<label>", { for: "inputPassword", text: "Password" });

        container.append(input);
        container.append(label);

        return container;
    },
    createCheckbox: function () {
        let container = $("<div>", { class: "checkbox mb-3" });
        let label = $("<label>");
        let input = $("<input>", { type: "checkbox", id: "remember", name: "remember", value: "remember" });
        let span = $("<span>", { class: "ml-1 text-dark", text: "Remember me" });

        container.append(label);
        label.append(input);
        label.append(span);

        return container;
    },
    createButtons: function () {
        let container = $("<div>");
        let signIn = $("<button>", { class: "btn btn-dark btn-block", id: "loginBtn", type: "submit", text: "Sign in" });
        let cancel = $("<button>", { class: "btn btn-dark btn-block", type: "reset", text: "Cancel" });

        container.append(signIn);
        container.append(cancel);

        return container;
    },
    clearPage: function () {
        $("#mainContent").empty();
    },
    setActiveNav: function () {
        $("#homeNavLink").removeClass("active");
        $("#loginNavLink").addClass("active");
        $("#registerNavLink").removeClass("active");
        $("#recipesNavLink").removeClass("active");
        $("#addNewNavLink").removeClass("active");
    }
};

let loginStatus = {
    checkLocalStorage: function (userType) {
        if (localStorage.authenticated == "YES" || sessionStorage.authenticated == "YES") {
            recipePageConstruction.loadPage(userType);
        }
    }
};

export { loginPageConstruction };