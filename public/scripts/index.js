"use strict";
import { landingPage } from './modules/landing.js';
import { loginPageConstruction } from './modules/login.js';
import { registerPageConstruction } from './modules/register.js';
import { recipePageConstruction } from './modules/recipes.js';
import { addRecipePageConstruction } from './modules/createrecipe.js';

$(function () {
    // Add functionality to NAV links
    $("#mastheadLink").on("click", function () {
        landingPage.loadPage();
    });
    $("#homeNavLink").on("click", function () {
        landingPage.loadPage();
    });
    $("#loginNavLink").on("click", function () {
        loginPageConstruction.loadPage();
    });
    $("#registerNavLink").on("click", function () {
        registerPageConstruction.loadPage();
    });

    // If user has a saved login session, shows the content access links on home page
    if (sessionStorage.authenticated == "YES" || localStorage.authenticated == "YES") {
        $("#recipesNavLink").show();
        $("#recipesNavLink").on("click", function () {
            recipePageConstruction.loadPage(sessionStorage.userType);
        });

        // If user is an admin, shows add a recipe link on home page
        if (sessionStorage.userType == "admin" || localStorage.userType == "admin") {
            $("#addNewNavLink").show();
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
    // Load landing page as first visible screen
    landingPage.loadPage();
});
