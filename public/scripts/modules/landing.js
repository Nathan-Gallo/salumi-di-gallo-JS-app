"use strict";
import { loginPageConstruction } from './login.js';
import { registerPageConstruction } from './register.js';
import { recipePageConstruction } from './recipes.js';
import { addRecipePageConstruction } from './createrecipe.js';



let landingPage = {
    loadPage: function () {
        this.clearPage();
        this.configureNav();
        let main = $("#mainContent");
        main.addClass("inner cover");
        main.append(this.createHeading());
        main.append(this.createLogo());
        main.append(this.createDescription());
        main.append(this.createButtons());
    },
    createHeading: function () {
        let heading = $("<h1>", { class: "cover-heading display-4 italiana", text: "Salumi di Gallo" });
        return heading;
    },
    createLogo: function () {
        // Put three different sized logos on page held in a paragraph
        // CSS will control which image will display based on screen size
        let paragraph = $("<p>", { class: "lead" });
        let logoLg = $("<img>", { class: "logo-lg", src: "images/logo-lg.png", alt: "logo-lg" });
        let logo = $("<img>", { class: "logo", src: "images/logo.png", alt: "logo" });
        let logo100px = $("<img>", { class: "logo-100px", src: "images/logo-100px.png", alt: "logo-100px" });

        paragraph.append(logoLg);
        paragraph.append(logo);
        paragraph.append(logo100px);

        return paragraph;
    },
    createDescription: function () {
        let paragraph = $("<p>", { class: "h3 font-weight-bold italiana", html: "Welcome to our passion project, please log in or register to view our recipes" });
        return paragraph;
    },
    createButtons: function () {
        let paragraph = $("<p>", { class: "lead btn-group mt-2", role: "group" });
        let login = $("<button>", { class: " italiana btn btn-lg btn-dark", id: "loginBtn", text: "Log in" });
        login.on("click", function () {
            loginPageConstruction.loadPage();
        });
        let register = $("<button>", { class: " italiana btn btn-lg btn-dark", id: "registerBtn", text: "Register" });
        register.on("click", function () {
            registerPageConstruction.loadPage();
        });

        paragraph.append(login);
        paragraph.append(register);

        return paragraph;
    },
    clearPage: function () {
        $("#mainContent").empty();
    },
    configureNav: function () {
        $("#homeNavLink").addClass("active");
        $("#loginNavLink").removeClass("active");
        $("#loginNavLink").show();
        $("#registerNavLink").removeClass("active");
        $("#registerNavLink").show();
        $("#recipesNavLink").hide();
        $("#logoutNavLink").hide();
        $("#addNewNavLink").hide();
        // If user has a saved login session, shows the content access links on home page
        if (sessionStorage.authenticated == "YES" || localStorage.authenticated == "YES") {
            $("#loginNavLink").hide();
            $("#registerNavLink").hide();
            $("#recipesNavLink").show();
            $("#recipesNavLink").removeClass("active");
            $("#recipesNavLink").on("click", function () {
                recipePageConstruction.loadPage(sessionStorage.userType);
            });
            $("#logoutNavLink").show();
            $("#logoutNavLink").on("click", function () {
                localStorage.removeItem("authenticated");
                sessionStorage.removeItem("authenticated");
                localStorage.removeItem("userType");
                sessionStorage.removeItem("userType");
                landingPage.loadPage();
            });

            // If user is an admin, shows add a recipe link on home page
            if (sessionStorage.userType == "admin" || localStorage.userType == "admin") {
                $("#addNewNavLink").show();
                $("#addNewNavLink").removeClass("active");
                $("#addNewNavLink").on("click", function () {
                    addRecipePageConstruction.loadPage();
                });
            }
            else {
                $("#addNewNavLink").hide();
                $("#addNewNavLink").off();
            }
        }
        else {
            $("#recipesNavLink").hide();
            $("#recipesNavLink").off();
        }
    }
};

export { landingPage };