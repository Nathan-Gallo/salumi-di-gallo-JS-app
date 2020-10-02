"use strict";

import { recipePageConstruction, ddlEventHandler } from './recipes.js';

let editRecipeConstruction = {
    loadPage: function (obj) {
        this.clearRecipe();
        editContentCreation.loadContent(obj);
        $("#mainContent").append(editRecipeConstruction.createModal(obj));
    },
    createModal: function (obj) {
        let modal = $("<div>", { class: "modal", tabindex: "-1", id: "deleteModal" });
        let modalDialog = $("<div>", { class: "modal-dialog modal-dialog-centered" });
        let modalContent = $("<div>", { class: "modal-content" });
        let modalHeader = $("<div>", { class: "modal-header" });
        let modalTitle = $("<h5>", { class: "modal-title", text: "Please confirm delete request" });
        let xButton = $("<button>", { type: "button", class: "close", dataDismiss: "modal", ariaLabel: "Close" });
        let xSpan = $("<span>", { ariaHidden: "true", html: "&times;" });
        xSpan.on("click", function () {
            $("#deleteModal").modal("hide");
        });
        let modalBody = $("<div>", { class: "modal-body" });
        let modalText = $("<p>", { text: "This action cannot be reversed" });
        let modalFooter = $("<div>", { class: "modal-footer" });
        let button = $("<button>", { type: "button", class: "btn btn-danger", dataDismiss: "modal", ariaLabel: "Close", text: "Delete recipe" });
        button.on("click", function () {
            $("#deleteModal").modal("hide");
            $.ajax({
                url: "/api/" + obj.id,
                data: JSON.stringify(obj),
                method: "DELETE",
                contentType: "application/json"
            })
                .done(function (data) {
                    console.dir(data);
                    recipePageConstruction.loadPage(sessionStorage.userType);
                })
                .fail(function (xhr) {
                    console.dir(xhr);
                });      
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
    clearRecipe: function () {
        $("#recipeBox").remove();
    }
};


let editContentCreation = {
    loadContent: function (obj) {
        let box = $("<div>", { class: "shadow p-2 mt-4 mb-3 bg-white rounded", id: "recipeBox" });
        $("#mainContent").append(box);
        let editDiv = $("<div>", { class: "d-flex justify-content-between row mb-2 px-2" });
        let save = $("<button>", { class: "btn btn-outline-success mr-2", id: obj.id, text: "Save" });
        let cancel = $("<button>", { class: "btn btn-outline-warning ml-2", text: "Cancel" });
        let deleteBtn = $("<button>", { class: "btn btn-outline-danger ml-2", text: "Delete" });
        save.on("click", function () {
            let meatArray = [];
            let meatCount = $("[name='meat']").length;
            for (let i = 0; i < meatCount; i++) {
                let object = {
                    "name": $("#meatName" + i).val(),
                    "weight": $("#meatWeight" + i).val(),
                    "ratio": $("#meatRatio" + i).val()
                };
                meatArray.push(object);
            }

            let curingIngredientsArray = [];
            let curingCount = $("[name='curing']").length;
            for (let i = 0; i < curingCount; i++) {
                let object = {
                    "name": $("#curingName" + i).val(),
                    "weight": $("#curingWeight" + i).val(),
                    "ratio": $("#curingRatio" + i).val()
                };
                curingIngredientsArray.push(object);
            }

            let aromaticsArray = [];
            let aromaticsCount = $("[name='aromatics']").length;
            for (let i = 0; i < aromaticsCount; i++) {
                let object = {
                    "name": $("#aromaticsName" + i).val(),
                    "weight": $("#aromaticsWeight" + i).val(),
                    "ratio": $("#aromaticsRatio" + i).val()
                };
                aromaticsArray.push(object);
            }

            let stepsArray = [];
            let stepsCount = $("[name='steps']").length;
            for (let i = 0; i < stepsCount; i++) {
                let step = $("#step" + i).val();
                stepsArray.push(step);
            }
            $.ajax({
                url: "/api/" + obj.id,
                data: JSON.stringify({
                    "ingredients": {
                        "meat": meatArray,
                        "curingIngredients": curingIngredientsArray,
                        "aromatics": aromaticsArray
                    },
                    "steps": stepsArray
                }),
                method: "PUT",
                contentType: "application/json"
            })
                .done(function (data) {
                    console.dir(data);
                    ddlEventHandler.selectOne(obj.id);
                })
                .fail(function (xhr) {
                    console.dir(xhr);
                });
        });
        cancel.on("click", function () {
            ddlEventHandler.selectOne(obj.id);
        });
        deleteBtn.on("click", function () {
            $("#deleteModal").modal("show");
        });
        let title = $("<h2>", { class: "text-center mt-3 mr-n2", text: obj.name });
        let subtitle = $("<p>", { class: "text-center", text: "Edit Instructions" });
        if (sessionStorage.userType == "admin") {
            box.append(editDiv);
            editDiv.append(cancel);
            editDiv.append(deleteBtn);
            editDiv.append(save);
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
            let nameCell = $("<td>");
            let name = $("<input>", { type: "text", name: "meat", id: "meatName" + i, value: meat[i].name });
            nameCell.append(name);
            let weightCell = $("<td>");
            let weight = $("<input>", { type: "number", id: "meatWeight" + i, value: meat[i].weight });
            weightCell.append(weight);
            let ratioCell = $("<td>");
            let ratio = $("<input>", { type: "number", id: "meatRatio" + i, value: meat[i].ratio });
            ratioCell.append(ratio);

            tbody.append(thisRow);
            thisRow.append(thisHead);
            thisRow.append(nameCell);
            thisRow.append(weightCell);
            thisRow.append(ratioCell);
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
            let nameCell = $("<td>");
            let name = $("<input>", { type: "text", name: "curing", id: "curingName" + i, value: curingIngredients[i].name });
            nameCell.append(name);
            let weightCell = $("<td>");
            let weight = $("<input>", { type: "number", id: "curingWeight" + i, value: curingIngredients[i].weight });
            weightCell.append(weight);
            let ratioCell = $("<td>");
            let ratio = $("<input>", { type: "number", id: "curingRatio" + i, value: curingIngredients[i].ratio });
            ratioCell.append(ratio);

            tbody.append(thisRow);
            thisRow.append(thisHead);
            thisRow.append(nameCell);
            thisRow.append(weightCell);
            thisRow.append(ratioCell);
        }

        // Attach aromatic components
        let aromaticTr = $("<tr>");
        tbody.append(aromaticTr);
        aromaticTr.append($("<th>", { scope: "row", text: "Aromatics" }));
        aromaticTr.append($("<td>"));
        aromaticTr.append($("<td>"));
        aromaticTr.append($("<td>"));

        let aromaticsLength = aromatics.length;
        for (let i = 0; i < aromaticsLength; i++) {
            let thisRow = $("<tr>");
            let thisHead = $("<th>", { scope: "row" });
            let nameCell = $("<td>");
            let name = $("<input>", { type: "text", name: "aromatics", id: "aromaticsName" + i, value: aromatics[i].name });
            nameCell.append(name);
            let weightCell = $("<td>");
            let weight = $("<input>", { type: "number", id: "aromaticsWeight" + i, value: aromatics[i].weight });
            weightCell.append(weight);
            let ratioCell = $("<td>");
            let ratio = $("<input>", { type: "number", id: "aromaticsRatio" + i, value: aromatics[i].ratio });
            ratioCell.append(ratio);

            tbody.append(thisRow);
            thisRow.append(thisHead);
            thisRow.append(nameCell);
            thisRow.append(weightCell);
            thisRow.append(ratioCell);
        }

        return table;
    },
    createRecipeSteps: function (obj) {
        let ul = $("<ul>", { class: "list-group text-left blockquote w-100" });

        let length = obj.steps.length;
        for (let i = 0; i < length; i++) {
            let li = $("<li>", { class: "list-group-item w-100" });
            ul.append(li);
            li.append($("<textarea>", { class: "w-100", rows: "3", name: "steps", id: "step" + i, html: obj.steps[i] }));
        }
        return ul;
    }
};

export { editRecipeConstruction };