"use strict";

import { loginPageConstruction } from './login.js';
import { landingPage } from './landing.js';
import { addRecipePageConstruction } from './createrecipe.js';
import { editRecipeConstruction } from './editrecipe.js';

// Contains all the methods needed to construct the page
let recipePageConstruction = {
    loadPage: function (userType) {
        this.clearPage();
        this.configureNav();

        pageValidation.validateUserType(userType);

        // Construction
        let main = $("#mainContent");
        main.addClass("inner cover");
        main.append(this.createDdl());
        radioEventHandlers.viewAll();
        main.append(this.createSecondaryDdl());
        main.append(this.createSearchFilters());
    },
    createDdl: function () {
        let container = $("<div>", { class: "container", id: "searchContainer" });
        let ddl = $("<select>", { class: "custom-select shadow bg-white rounded mb-2", id: "recipeDdl" });
        let defaultOption = $("<option>", { value: "-1", text: "Select a Recipe" });

        // Ddl values change based on radio button selection, 
        // finds the right event handler to use
        ddl.on("change", function () {
            if ($("#viewAll").is(":checked") && ddl.val() != "-1") {
                if ($("#recipeBox")) {
                    $("#recipeBox").remove();
                }
                ddlEventHandler.selectOne(ddl.val());
            }
            else if ($("#byCategory").is(":checked") && ddl.val() != "-1") {
                $("#secondaryContainer").show();
                $("#filteredRecipeDdl").prop("options").length = 1;
                ddlEventHandler.selectCategory(ddl.val());
               
            }
            else if ($("#byDifficulty").is(":checked") && ddl.val() != "-1") {
                    $("#secondaryContainer").show();
                    $("#filteredRecipeDdl").prop("options").length = 1;
                    ddlEventHandler.selectDifficulty(ddl.val());           
            }
        });
        container.append(ddl);
        ddl.append(defaultOption);

        return container;
    },
    createSecondaryDdl: function () {
        // If view by category or difficulty are selected, the first Ddl chooses the filter
        // This second Ddl is then created and populated with the recipes that match the filter
        let container = $("<div>", { class: "container", id: "secondaryContainer", style: "display:none" });
        let ddl = $("<select>", { class: "custom-select shadow bg-white rounded mb-2", id: "filteredRecipeDdl" });
        let defaultOption = $("<option>", { value: "-1", text: "Select a Recipe" });
        ddl.on("change", function () {
            if (ddl.val() != "-1") {
                if ($("#recipeBox")) {
                    $("#recipeBox").remove();
                }
                ddlEventHandler.selectOne(ddl.val());
            }
        });
        container.append(ddl);
        ddl.append(defaultOption);

        return container;
    },
    createSearchFilters: function () {
        // Creates the radio buttons which allows the user to filter the recipes
        let container = $("<div>", { id: "radioDiv" });
        let viewDiv = $("<div>", { class: "form-check form-check-inline" });
        let categoryDiv = $("<div>", { class: "form-check form-check-inline" });
        let difficultyDiv = $("<div>", { class: "form-check form-check-inline" });
        let viewAll = $("<input>", { class: "form-check-input", type: "radio", name: "searchBy", id: "viewAll", value: "all", checked: "checked" });
        viewAll.on("click", function () {
            $("#secondaryContainer").hide();
            radioEventHandlers.viewAll();
        });
        let byCategory = $("<input>", { class: "form-check-input", type: "radio", name: "searchBy", id: "byCategory", value: "category" });
        byCategory.on("click", function () {
            $("#filteredRecipeDdl").prop("options").length = 1;
            radioEventHandlers.viewByCategory();
        });
        let byDifficulty = $("<input>", { class: "form-check-input", type: "radio", name: "searchBy", id: "byDifficulty", value: "difficulty" });
        byDifficulty.on("click", function () {
            $("#filteredRecipeDdl").prop("options").length = 1;
            radioEventHandlers.viewByDifficulty();
        });
        let viewAllLabel = $("<label>", { class: "form-check-label", for: "viewAll", text: "View All" });
        let byCategoryLabel = $("<label>", { class: "form-check-label", for: "byCategory", text: "View by Category" });
        let byDifficultyLabel = $("<label>", { class: "form-check-label", for: "byDifficulty", text: "View by Difficulty" });

        container.append(viewDiv);
        viewDiv.append(viewAll);
        viewDiv.append(viewAllLabel);
        container.append(categoryDiv);
        categoryDiv.append(byCategory);
        categoryDiv.append(byCategoryLabel);
        container.append(difficultyDiv);
        difficultyDiv.append(byDifficulty);
        difficultyDiv.append(byDifficultyLabel);

        return container;
    },
    configureNav: function () {
        $("#homeNavLink").removeClass("active");
        $("#loginNavLink").removeClass("active");
        $("#loginNavLink").hide();
        $("#registerNavLink").hide();
        $("#recipesNavLink").show();
        $("#recipesNavLink").addClass("active");
        $("#addNewNavLink").removeClass("active");
        $("#logoutNavLink").show();
        $("#logoutNavLink").on("click", function () {
            localStorage.removeItem("authenticated");
            sessionStorage.removeItem("authenticated");
            localStorage.removeItem("userType");
            sessionStorage.removeItem("userType");
            landingPage.loadPage();
        });
    },
    clearPage: function () {
        $("#mainContent").empty();
    }
};

// Contains all GET api's to populate the Ddl with options
let radioEventHandlers = {
    viewAll: function () {
        let ddl = $("#recipeDdl");
        ddl.prop("options").length = 0;
        let defaultOption = $("<option>", { text: "Select a Recipe", value: "-1" });
        ddl.append(defaultOption);
        $.getJSON("/api/", function (results) {

            let length = results.data.length;

            for (let i = 0; i < length; i++) {
                let theOption = $("<option>", { text: results.data[i].name, value: results.data[i].id });
                ddl.append(theOption);
            }
        })
            .fail(function (xhr) {
                console.log(xhr.status + ": " + xhr.message);
            });
    },
    viewByCategory: function () {
        let ddl = $("#recipeDdl");
        ddl.prop("options").length = 0;
        let defaultOption = $("<option>", { text: "Select a Category", value: "-1" });
        ddl.append(defaultOption);
        $.getJSON("/api/", function (results) {
            // Remove duplicates so Ddl only shows one option for each category
            let filtered = results.data.filter((v, i, a) => a.findIndex(t => (t.category === v.category)) === i);

            let length = filtered.length;
            // Populate options on Ddl
            for (let i = 0; i < length; i++) {
                let theOption = $("<option>", { text: filtered[i].category, value: filtered[i].category });
                ddl.append(theOption);
            }
        })
            .fail(function (xhr) {
                console.log(xhr.status + ", " + xhr.message);
            });
    },
    viewByDifficulty: function () {
        let ddl = $("#recipeDdl");
        ddl.prop("options").length = 0;
        let defaultOption = $("<option>", { text: "Select a Difficulty", value: "-1" });
        ddl.append(defaultOption);
        $.getJSON("/api/", function (results) {
            // Remove duplicates so Ddl only shows one option for each difficulty
            let filtered = results.data.filter((v, i, a) => a.findIndex(t => (t.difficulty === v.difficulty)) === i);

            let length = filtered.length;
            // Populate options on Ddl
            for (let i = 0; i < length; i++) {
                let theOption = $("<option>", { text: filtered[i].difficulty, value: filtered[i].difficulty });
                ddl.append(theOption);
            }
        })
            .fail(function (xhr) {
                console.log(xhr.status + ", " + xhr.message);
            });
    }
};

let ddlEventHandler = {
    selectOne: function (id) {
        // Passes in an id to retrieve data of a single recipe
        $.getJSON("/api/" + id, function (results) {
            contentCreation.loadContent(results.data);
        })
            .fail(function (xhr) {
                console.log(xhr.status + ", " + xhr.message);
            });
    },
    selectCategory: function (category) {
        // Passes in a category name to retrieve all recipes in that category
        $.getJSON("/api/category/" + category, function (results) {
            let ddl = $("#filteredRecipeDdl");

            let length = results.data.length;
            // Populate options on Ddl
            for (let i = 0; i < length; i++) {
                let theOption = $("<option>", { text: results.data[i].name, value: results.data[i].id });
                ddl.append(theOption);
            }
        })
            .fail(function (xhr) {
                console.log(xhr.status + ", " + xhr.message);
            });
    },
    selectDifficulty: function (difficulty) {
        // Passes in a difficulty name to retrieve all recipes in that difficulty
        $.getJSON("/api/difficulty/" + difficulty, function (results) {
            let ddl = $("#filteredRecipeDdl");

            let length = results.data.length;
            // Populate options on Ddl
            for (let i = 0; i < length; i++) {
                let theOption = $("<option>", { text: results.data[i].name, value: results.data[i].id });
                ddl.append(theOption);
            }
        })
            .fail(function (xhr) {
                console.log(xhr.status + ", " + xhr.message);
            });
    }
};

// Functions to create the display of the recipe data
let contentCreation = {
    loadContent: function (obj) {
        if ($("#recipeBox")) {
            $("#recipeBox").remove();
        }
        let box = $("<div>", { class: "shadow p-2 mt-4 mb-3 bg-white rounded", id: "recipeBox" });
        $("#mainContent").append(box);
        let editDiv = $("<div>", { class: "d-flex justify-content-end row mb-2 px-2" });
        let edit = $("<button>", { class: "btn btn-outline-info mr-2", id: obj.id, text: "edit" });
        edit.on("click", function () {
            editRecipeConstruction.loadPage(obj);
        });
        let title = $("<h2>", { class: "text-center mt-3 mr-n2", text: obj.name });
        let subtitle = $("<p>", { class: "text-center", text: "Instructions" });
        if (sessionStorage.userType == "admin") {
            box.append(editDiv);
            editDiv.append(edit);
        }
        else {
            box.remove(editDiv);
        }
        box.append(title);
        box.append(subtitle);
        // Not all recipes have an image, verifies property exists before attempting creation
        if (obj.image) {
            box.append(this.createImageHeading(obj));
        }
        let ingredients = $("<h3>", { class: "text-center", text: "Ingredients" });
        let headingFooter = $("<p>", { class: "lead font-weight-light", text: "Adjust curing ingredient weights based on ratio to meat" });

        box.append(ingredients);
        box.append(headingFooter);
        box.append(this.createIngredientTable(obj));
        box.append(this.createRecipeSteps(obj));

    },
    createImageHeading: function (obj) {
        let container = $("<div>", { class: "container" });
        let image = $("<img>", { src: "../images/" + obj.image, alt: obj.name, class: "image shadow p-1 mt-4 mb-3 bg-white rounded", style: "width:100%" });
        let labelDiv = $("<div>", { class: "middle" });
        let label = $("<p>", { class: "btn btn-dark active", text: obj.name });

        container.append(image);
        container.append(labelDiv);
        labelDiv.append(label);

        return container;
    },
    createIngredientTable: function (obj) {
        // Pull apart recipe to help build table
        let meat = obj.ingredients.meat;
        let curingIngredients = obj.ingredients.curingIngredients;
        let aromatics = obj.ingredients.aromatics;

        let table = $("<table>", { class: "table table-sm table-hover shadow bg-white rounded" });
        // Create table header
        let thead = $("<thead>", { class: "thead-dark" });
        let headTr = $("<tr>");
        let thCategory = $("<th>", { scope: "col", text: "Category" });
        let thName = $("<th>", { scope: "col", text: "Name" });
        let thWeight = $("<th>", { scope: "col", text: "Weight (g)" });
        let thRatio = $("<th>", { scope: "col", text: "Ratio (%)" });

        // append header
        table.append(thead);
        thead.append(headTr);
        headTr.append(thCategory);
        headTr.append(thName);
        headTr.append(thWeight);
        headTr.append(thRatio);

        // Create table body
        let tbody = $("<tbody>");
        table.append(tbody);

        // Attach meat components
        let meatTr = $("<tr>");
        tbody.append(meatTr);
        meatTr.append($("<th>", { scope: "row", text: "Meat" }));
        meatTr.append($("<td>"));
        meatTr.append($("<td>"));
        meatTr.append($("<td>"));

        let meatLength = meat.length;
        for (let i = 0; i < meatLength; i++) {
            let thisRow = $("<tr>");
            let thisHead = $("<th>", { scope: "row" });
            let name = $("<td>", { text: meat[i].name });
            let weight = $("<td>", { text: meat[i].weight });
            let ratio = $("<td>", { text: meat[i].ratio });

            tbody.append(thisRow);
            thisRow.append(thisHead);
            thisRow.append(name);
            thisRow.append(weight);
            thisRow.append(ratio);
        }

        // Attach Curing components
        let curingTr = $("<tr>");
        tbody.append(curingTr);
        curingTr.append($("<th>", { scope: "row", text: "Curing Ingredients" }));
        curingTr.append($("<td>"));
        curingTr.append($("<td>"));
        curingTr.append($("<td>"));

        let curingLength = curingIngredients.length;
        for (let i = 0; i < curingLength; i++) {
            let thisRow = $("<tr>");
            let thisHead = $("<th>", { scope: "row" });
            let name = $("<td>", { text: curingIngredients[i].name });
            let weight = $("<td>", { text: curingIngredients[i].weight });
            let ratio = $("<td>", { text: curingIngredients[i].ratio });

            tbody.append(thisRow);
            thisRow.append(thisHead);
            thisRow.append(name);
            thisRow.append(weight);
            thisRow.append(ratio);
        }

        // Attach aromatic components
        let aromaticTr = $("<tr>");
        tbody.append(aromaticTr);
        aromaticTr.append($("<th>", { scope: "row", text: "Curing Ingredients" }));
        aromaticTr.append($("<td>"));
        aromaticTr.append($("<td>"));
        aromaticTr.append($("<td>"));

        let aromaticsLength = aromatics.length;
        for (let i = 0; i < aromaticsLength; i++) {
            let thisRow = $("<tr>");
            let thisHead = $("<th>", { scope: "row" });
            let name = $("<td>", { text: aromatics[i].name });
            let weight = $("<td>", { text: aromatics[i].weight });
            let ratio = $("<td>", { text: aromatics[i].ratio });

            tbody.append(thisRow);
            thisRow.append(thisHead);
            thisRow.append(name);
            thisRow.append(weight);
            thisRow.append(ratio);
        }

        return table;
    },
    createRecipeSteps: function (obj) {
        let ul = $("<ul>", { class: "list-group text-left blockquote" });

        let length = obj.steps.length;
        for (let i = 0; i < length; i++) {
            ul.append($("<li>", { class: "list-group-item", text: obj.steps[i] }));
        }
        return ul;
    }
};


let pageValidation = {
    validateCredentials: function () {
        // If login authentication has not been completed, user is directed back to login screen
        if (localStorage.authenticated != "YES" || sessionStorage.authenticated != "YES") {
            loginPageConstruction.loadPage();
        }
        else {
            return true;
        }
    },
    validateUserType: function (userType) {
        if (userType == "admin") {
            $("#addNewNavLink").show();
            $("#addNewNavLink").on("click", addRecipePageConstruction.loadPage);
        }
        else {
            $("#addNewNavLink").hide();
            $("#addNewNavLink").off();
        }
    }
};

export { recipePageConstruction, ddlEventHandler };