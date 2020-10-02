"use strict";

import { recipePageConstruction } from './recipes.js';
import { landingPage } from './landing.js';


let addRecipePageConstruction = {
    loadPage: function () {
        addRecipePageConstruction.clearPage();
        addRecipePageConstruction.configureNav();
        let main = $("#mainContent");
        main.addClass("inner cover");
        
        // Add form to page
        main.append(addRecipePageConstruction.createForm());
        main.append(addRecipePageConstruction.createModal());

    },
    createForm: function () {
        let box = $("<div>", { class: "shadow p-2 mt-4 mb-3 bg-white rounded", id: "recipeBox" });
        box.append($("<h2>", { html: "Enter recipe details<br>" }));
        box.append($("<hr>"));
        let form = $("<form>", { id: "newRecipe", enctype: "multipart/form-data" });
        form.on("submit", function (event) {
            event.preventDefault();

            // # of fields varies, loop to find all of them to add
            let meatArray = [];
            for (let i = 0; i < meatCount; i++) {
                let object = {
                    "name": $("#meatName" + i).val(),
                    "weight": $("#meatWeight" + i).val(),
                    "ratio": $("#meatRatio" + i).val()
                };
                meatArray.push(object);
            }

            let curingIngredientsArray = [];
            for (let i = 0; i < curingCount; i++) {
                let object = {
                    "name": $("#curingName" + i).val(),
                    "weight": $("#curingWeight" + i).val(),
                    "ratio": $("#curingRatio" + i).val()
                };
                curingIngredientsArray.push(object);
            }

            let aromaticsArray = [];
            for (let i = 0; i < aromaticsCount; i++) {
                let object = {
                    "name": $("#aromaticsName" + i).val(),
                    "weight": $("#aromaticsWeight" + i).val(),
                    "ratio": $("#aromaticsRatio" + i).val()
                };
                aromaticsArray.push(object);
            }

            let stepsArray = [];
            for (let i = 1; i < stepsCount; i++) {
                let step = $("#step" + i).val();
                stepsArray.push(step);
            }

            // Post recipe to server            
            $.post({
                url: "/api/",
                data: JSON.stringify({
                    "name": $("#name").val(),
                    "category": $("#category").val(),
                    "type": $("#type").val(),
                    "difficulty": $("#difficulty").val(),
                    "image": $("#file").val(),
                    "ingredients": {
                        "meat": meatArray,
                        "curingIngredients": curingIngredientsArray,
                        "aromatics": aromaticsArray
                    },
                    "steps": stepsArray
                }),
                contentType: "application/json"
            })
                .done(function (data) {
                    // Check if an image is being uploaded with the recipe
                    // If yes, post the image to the server to be linked with the recipe then redirect to view recipe page
                    // If no, skip this step and bring user to view recipe page         
                    if ($("#file").val()) {
                        const input = document.getElementById("file");
                        const xhr = new XMLHttpRequest();
                        xhr.addEventListener("readystatechange", () => {
                            if (xhr.readyState == 4) {
                                $("#recipeModal").modal("show");
                            }
                        });
                        xhr.open("POST", "/api/file");
                        let formData = new FormData();
                        formData.append("myFile", input.files[0]);
                        console.dir(input.files[0])
                        xhr.send(formData);
                    }
                    else {
                        $("#recipeModal").modal("show");
                    }
                })
                .fail(function (xhr, status, error) {
                    console.dir(xhr);
                });
        });
        box.append(form);

        // Input group 1 - recipe name
        let formGroup1 = $("<div>", { class: "form-group row" });
        let labelName = $("<label>", { class: "col-sm-3 col-form-label", for: "name", text: "Recipe Name" });
        let inputDiv1 = $("<div>", { class: "col-sm-9" });
        let inputName = $("<input>", { type: "text", class: "form-control", id: "name", placeholder: "Name", required: "required", autofocus: "autofocus" });

        formGroup1.append(labelName);
        formGroup1.append(inputDiv1);
        inputDiv1.append(inputName);

        // Input group - image upload
        let formGroupImage = $("<div>", { class: "form-group row" });
        let labelImage = $("<label>", { class: "col-sm-3 col-form-label", for: "file", text: "Recipe Image (optional)" });
        let inputDivImage = $("<div>", { class: "col-sm-9" });
        let inputFile = $("<input>", { type: "file", class: "form-control-file mt-2", id: "file"});

        formGroupImage.append(labelImage);
        formGroupImage.append(inputDivImage);
        inputDivImage.append(inputFile);

        // Input group 2 - category
        let formGroup2 = $("<div>", { class: "form-group row" });
        let labelCategory = $("<label>", { class: "col-sm-3 col-form-label", for: "category", text: "Category" });
        let inputDiv2 = $("<div>", { class: "col-sm-9" });
        let inputCategory = $("<select>", { class: "custom-select", id: "category" });
        let category1 = $("<option>", { value: "-1", text: "Select a Category" });
        let category2 = $("<option>", { value: "Beef", text: "Beef" });
        let category3 = $("<option>", { value: "Goat", text: "Goat" });
        let category4 = $("<option>", { value: "Lamb", text: "Lamb" });
        let category5 = $("<option>", { value: "Pork", text: "Pork" });
        let category6 = $("<option>", { value: "Poultry", text: "Poultry" });

        inputCategory.append(category1);
        inputCategory.append(category2);
        inputCategory.append(category3);
        inputCategory.append(category4);
        inputCategory.append(category5);
        inputCategory.append(category6);

        formGroup2.append(labelCategory);
        formGroup2.append(inputDiv2);
        inputDiv2.append(inputCategory);

        // Input group 3 - type
        let formGroup3 = $("<div>", { class: "form-group row" });
        let labelType = $("<label>", { class: "col-sm-3 col-form-label", for: "type", text: "Type" });
        let inputDiv3 = $("<div>", { class: "col-sm-9" });
        let inputType = $("<select>", { class: "custom-select", id: "type" });
        let type1 = $("<option>", { value: "-1", text: "Select a type" });
        let type2 = $("<option>", { value: "Salumi", text: "Salumi (whole muscle)" });
        let type3 = $("<option>", { value: "Salami", text: "Salami (ground meat)" });

        inputType.append(type1);
        inputType.append(type2);
        inputType.append(type3);

        formGroup3.append(labelType);
        formGroup3.append(inputDiv3);
        inputDiv3.append(inputType);

        // Input group 4 - difficulty
        let formGroup4 = $("<div>", { class: "form-group row" });
        let labelDifficulty = $("<label>", { class: "col-sm-3 col-form-label", for: "difficulty", text: "Difficulty" });
        let inputDiv4 = $("<div>", { class: "col-sm-9" });
        let inputDifficulty = $("<select>", { class: "custom-select", id: "difficulty" });
        let difficulty1 = $("<option>", { value: "-1", text: "Select a difficulty" });
        let difficulty2 = $("<option>", { value: "Beginner", text: "Beginner" });
        let difficulty3 = $("<option>", { value: "Intermediate", text: "Intermediate" });
        let difficulty4 = $("<option>", { value: "Advanced", text: "Advanced" });

        inputDifficulty.append(difficulty1);
        inputDifficulty.append(difficulty2);
        inputDifficulty.append(difficulty3);
        inputDifficulty.append(difficulty4);

        formGroup4.append(labelDifficulty);
        formGroup4.append(inputDiv4);
        inputDiv4.append(inputDifficulty);

        // Input group 5 - Meat
        let formGroupMeat = $("<div>", { class: "form-group row" });
        let labelMeat = $("<label>", { class: "col-sm-3 col-form-label", for: "meatName0", text: "Meat" });
        let inputDivMeatName = $("<div>", { class: "col" });
        let inputMeatName = $("<input>", { type: "text", class: "form-control", id: "meatName0", placeholder: "Name", required: "required" });
        let inputDivMeatWeight = $("<div>", { class: "col" });
        let inputMeatWeight = $("<input>", { type: "number", class: "form-control", id: "meatWeight0", placeholder: "Weight", required: "required" });
        let inputDivMeatRatio = $("<div>", { class: "col" });
        let inputMeatRatio = $("<input>", { type: "number", class: "form-control", step: ".01", min: ".01", max: "100", id: "meatRatio0", placeholder: "Ratio", required: "required" });

        formGroupMeat.append(labelMeat);
        formGroupMeat.append(inputDivMeatName);
        inputDivMeatName.append(inputMeatName);
        formGroupMeat.append(inputDivMeatWeight);
        inputDivMeatWeight.append(inputMeatWeight);
        formGroupMeat.append(inputDivMeatRatio);
        inputDivMeatRatio.append(inputMeatRatio);

        // Button to add more ingredients to this category
        let moreMeatButton = $("<button>", { class: "btn btn-outline-info btn-sm mb-2", id: "moreMeatButton", type: "button", text: "Add additional meat" });
        let meatCount = 1;
        moreMeatButton.on("click", function () {
            let formGroupMeat2 = $("<div>", { class: "form-group row", id: "row" + meatCount });
            let spacingDiv = $("<label>", { class: "col-sm-3 col-form-label" });
            let inputDivMeatName2 = $("<div>", { class: "col" });
            let inputMeatName2 = $("<input>", { type: "text", class: "form-control", id: "meatName" + meatCount, placeholder: "Name", required: "required" });
            let inputDivMeatWeight2 = $("<div>", { class: "col" });
            let inputMeatWeight2 = $("<input>", { type: "number", class: "form-control", id: "meatWeight" + meatCount, placeholder: "Weight", required: "required" });
            let inputDivMeatRatio2 = $("<div>", { class: "col" });
            let inputMeatRatio2 = $("<input>", { type: "number", class: "form-control", step: ".01", min: ".01", max: "100", id: "meatRatio" + meatCount, placeholder: "Ratio", required: "required" });

            // Add a button to remove the newly created row
            let inputDivRemove = $("<div>", { class: "col-1" });
            let removeRow = $("<button>", { class: "btn btn-outline-danger btn-sm", type: "button", text: "X" });
            removeRow.on("click", function () {
                // Remove the row and lower count to make button accessible again
                formGroupMeat2.remove();
                meatCount -= 1;
                if (meatCount == 4) {
                    moreMeatButton.hide();
                }
                else {
                    moreMeatButton.show();
                }
            });

            formGroupMeat2.append(spacingDiv);
            formGroupMeat2.append(inputDivMeatName2);
            inputDivMeatName2.append(inputMeatName2);
            formGroupMeat2.append(inputDivMeatWeight2);
            inputDivMeatWeight2.append(inputMeatWeight2);
            formGroupMeat2.append(inputDivMeatRatio2);
            inputDivMeatRatio2.append(inputMeatRatio2);
            formGroupMeat2.append(inputDivRemove);
            inputDivRemove.append(removeRow);
            moreMeatButton.before(formGroupMeat2);
            meatCount++;
            // hide the button to limit the amount of rows that can be created
            if (meatCount == 4) {
                moreMeatButton.hide();
            }
            else {
                moreMeatButton.show();

            }
        });

        // Input group 6 - Curing Ingredients
        let formGroupCuring = $("<div>", { class: "form-group row" });
        let labelCuring = $("<label>", { class: "col-sm-3 col-form-label", for: "curingName0", text: "Curing Ingredients" });
        let inputDivCuringName = $("<div>", { class: "col" });
        let inputCuringName = $("<input>", { type: "text", class: "form-control", id: "curingName0", placeholder: "Name", required: "required" });
        let inputDivCuringWeight = $("<div>", { class: "col" });
        let inputCuringWeight = $("<input>", { type: "number", class: "form-control", id: "curingWeight0", placeholder: "Weight", required: "required" });
        let inputDivCuringRatio = $("<div>", { class: "col" });
        let inputCuringRatio = $("<input>", { type: "number", class: "form-control", step: ".01", min: ".01", max: "100", id: "curingRatio0", placeholder: "Ratio", required: "required" });

        formGroupCuring.append(labelCuring);
        formGroupCuring.append(inputDivCuringName);
        inputDivCuringName.append(inputCuringName);
        formGroupCuring.append(inputDivCuringWeight);
        inputDivCuringWeight.append(inputCuringWeight);
        formGroupCuring.append(inputDivCuringRatio);
        inputDivCuringRatio.append(inputCuringRatio);

        // Button to add more ingredients to this category
        let moreCuringButton = $("<button>", { class: "btn btn-outline-info btn-sm mb-2", id: "moreCuringButton", type: "button", text: "Add additional curing ingredients" });
        let curingCount = 1;
        moreCuringButton.on("click", function () {
            let formGroupCuring2 = $("<div>", { class: "form-group row" });
            let spacingDiv = $("<label>", { class: "col-sm-3 col-form-label" });
            let inputDivCuringName2 = $("<div>", { class: "col" });
            let inputCuringName2 = $("<input>", { type: "text", class: "form-control", id: "curingName" + curingCount, placeholder: "Name", required: "required" });
            let inputDivCuringWeight2 = $("<div>", { class: "col" });
            let inputCuringWeight2 = $("<input>", { type: "number", class: "form-control", id: "curingWeight" + curingCount, placeholder: "Weight", required: "required" });
            let inputDivCuringRatio2 = $("<div>", { class: "col" });
            let inputCuringRatio2 = $("<input>", { type: "number", class: "form-control", step: ".01", min: ".01", max: "100", id: "curingRatio" + curingCount, placeholder: "Ratio", required: "required" });

            // Add a button to remove the newly created row
            let inputDivRemove = $("<div>", { class: "col-1" });
            let removeRow = $("<button>", { class: "btn btn-outline-danger btn-sm", type: "button", text: "X" });
            removeRow.on("click", function () {
                // Remove the row and lower count to make button accessible again
                formGroupCuring2.remove();
                curingCount -= 1;
                if (curingCount == 4) {
                    moreCuringButton.hide();
                }
                else {
                    moreCuringButton.show();
                }
            });

            formGroupCuring2.append(spacingDiv);
            formGroupCuring2.append(inputDivCuringName2);
            inputDivCuringName2.append(inputCuringName2);
            formGroupCuring2.append(inputDivCuringWeight2);
            inputDivCuringWeight2.append(inputCuringWeight2);
            formGroupCuring2.append(inputDivCuringRatio2);
            inputDivCuringRatio2.append(inputCuringRatio2);
            formGroupCuring2.append(inputDivRemove);
            inputDivRemove.append(removeRow);
            moreCuringButton.before(formGroupCuring2);

            curingCount++;
            // hide the button to limit the amount of rows that can be created
            if (curingCount == 4) {
                moreCuringButton.hide();
            } else {
                moreCuringButton.show();
            }
        });

        // Input group 7 - Aromatics
        let formGroupAromatics = $("<div>", { class: "form-group row" });
        let labelAromatics = $("<label>", { class: "col-sm-3 col-form-label", for: "aromaticsName0", text: "Aromatics" });
        let inputDivAromaticsName = $("<div>", { class: "col" });
        let inputAromaticsName = $("<input>", { type: "text", class: "form-control", id: "aromaticsName0", placeholder: "Name", required: "required" });
        let inputDivAromaticsWeight = $("<div>", { class: "col" });
        let inputAromaticsWeight = $("<input>", { type: "number", class: "form-control", id: "aromaticsWeight0", placeholder: "Weight", required: "required" });
        let inputDivAromaticsRatio = $("<div>", { class: "col" });
        let inputAromaticsRatio = $("<input>", { type: "number", class: "form-control", id: "aromaticsRatio0", step: ".01", min: ".01", max: "100", placeholder: "Ratio", required: "required" });

        formGroupAromatics.append(labelAromatics);
        formGroupAromatics.append(inputDivAromaticsName);
        inputDivAromaticsName.append(inputAromaticsName);
        formGroupAromatics.append(inputDivAromaticsWeight);
        inputDivAromaticsWeight.append(inputAromaticsWeight);
        formGroupAromatics.append(inputDivAromaticsRatio);
        inputDivAromaticsRatio.append(inputAromaticsRatio);

        // Button to add more ingredients to this category
        let moreAromaticsButton = $("<button>", { class: "btn btn-outline-info btn-sm mb-2", id: "moreAromaticsButton", type: "button", text: "Add additional aromatics ingredients" });
        let aromaticsCount = 1;
        moreAromaticsButton.on("click", function () {
            let formGroupAromatics2 = $("<div>", { class: "form-group row", id: "aromaticsRow" + aromaticsCount });
            let spacingDiv = $("<label>", { class: "col-sm-3 col-form-label" });
            let inputDivAromaticsName2 = $("<div>", { class: "col" });
            let inputAromaticsName2 = $("<input>", { type: "text", class: "form-control", id: "aromaticsName" + aromaticsCount, placeholder: "Name", required: "required" });
            let inputDivAromaticsWeight2 = $("<div>", { class: "col" });
            let inputAromaticsWeight2 = $("<input>", { type: "number", class: "form-control", id: "aromaticsWeight" + aromaticsCount, placeholder: "Weight", required: "required" });
            let inputDivAromaticsRatio2 = $("<div>", { class: "col" });
            let inputAromaticsRatio2 = $("<input>", { type: "number", class: "form-control", step: ".01", min: ".01", max: "100", id: "aromaticsRatio" + aromaticsCount, placeholder: "Ratio", required: "required" });

            // Add a button to remove the newly created row
            let inputDivRemove = $("<div>", { class: "col-1" });
            let removeRow = $("<button>", { class: "btn btn-outline-danger btn-sm", type: "button", text: "X" });
            removeRow.on("click", function () {
                formGroupAromatics2.remove();
                aromaticsCount -= 1;
                if (aromaticsCount == 6) {
                    moreAromaticsButton.hide();
                }
                else {
                    moreAromaticsButton.show();
                }
            });

            formGroupAromatics2.append(spacingDiv);
            formGroupAromatics2.append(inputDivAromaticsName2);
            inputDivAromaticsName2.append(inputAromaticsName2);
            formGroupAromatics2.append(inputDivAromaticsWeight2);
            inputDivAromaticsWeight2.append(inputAromaticsWeight2);
            formGroupAromatics2.append(inputDivAromaticsRatio2);
            inputDivAromaticsRatio2.append(inputAromaticsRatio2);
            formGroupAromatics2.append(inputDivRemove);
            inputDivRemove.append(removeRow);
            moreAromaticsButton.before(formGroupAromatics2);

            aromaticsCount++;
            // hide the button to limit the amount of rows that can be created
            if (aromaticsCount == 6) {
                moreAromaticsButton.hide();
            }
            else {
                moreAromaticsButton.show();
            }
        });

        // Input group 8 - Steps
        let formGroupSteps = $("<div>");
        let stepRow1 = $("<div>", { class: "form-group row" });
        let labelStep1 = $("<label>", { class: "col-sm-3 col-form-label", for: "step1", text: "Step 1" });
        let divStep1 = $("<div>", { class: "col-sm-9" });
        let inputStep1 = $("<input>", { type: "text", class: "form-control", id: "step1", placeholder: "Step 1" });
        let stepRow2 = $("<div>", { class: "form-group row" });
        let labelStep2 = $("<label>", { class: "col-sm-3 col-form-label", for: "step2", text: "Step 2" });
        let divStep2 = $("<div>", { class: "col-sm-9" });
        let inputStep2 = $("<input>", { type: "text", class: "form-control", id: "step2", placeholder: "Step 2", required: "required" });
        let stepRow3 = $("<div>", { class: "form-group row" });
        let labelStep3 = $("<label>", { class: "col-sm-3 col-form-label", for: "step3", text: "Step 3" });
        let divStep3 = $("<div>", { class: "col-sm-9" });
        let inputStep3 = $("<input>", { type: "text", class: "form-control", id: "step3", placeholder: "Step 3", required: "required" });

        formGroupSteps.append(stepRow1);
        stepRow1.append(labelStep1);
        stepRow1.append(divStep1);
        divStep1.append(inputStep1);
        formGroupSteps.append(stepRow2);
        stepRow2.append(labelStep2);
        stepRow2.append(divStep2);
        divStep2.append(inputStep2);
        formGroupSteps.append(stepRow3);
        stepRow3.append(labelStep3);
        stepRow3.append(divStep3);
        divStep3.append(inputStep3);

        // Button to add more ingredients to this category
        let moreStepsButton = $("<button>", { class: "btn btn-outline-info btn-sm mb-2", id: "moreStepsButton", type: "button", text: "Add additional steps" });
        let stepsCount = 4;
        moreStepsButton.on("click", function () {
            let stepRow = $("<div>", { class: "form-group row" });
            let labelStep = $("<label>", { class: "col-sm-3 col-form-label", for: "step" + stepsCount, text: "Step " + stepsCount });
            let divStep = $("<div>", { class: "col-sm" });
            let inputStep = $("<input>", { type: "text", class: "form-control", id: "step" + stepsCount, placeholder: "Step " + stepsCount, required: "required" });

            // Add a button to remove the newly created row
            let inputDivRemove = $("<div>", { class: "col-1" });
            let removeRow = $("<button>", { class: "btn btn-outline-danger btn-sm", type: "button", text: "X" });
            removeRow.on("click", function () {
                stepRow.remove();
                stepsCount -= 1;
                if (stepsCount == 15) {
                    moreStepsButton.hide();
                }
                else {
                    moreStepsButton.show();
                }
            });

            formGroupSteps.append(stepRow);
            stepRow.append(labelStep);
            stepRow.append(divStep);
            divStep.append(inputStep);
            stepRow.append(inputDivRemove);
            inputDivRemove.append(removeRow);
            moreStepsButton.before(stepRow);

            stepsCount++;
            // hide the button to limit the amount of rows that can be created
            if (stepsCount == 15) {
                moreStepsButton.hide();
            }
            else {
                moreStepsButton.show();
            }
        });

        // Attach all elements to form
        form.append(formGroup1);
        form.append(formGroupImage);
        form.append(formGroup2);
        form.append(formGroup3);
        form.append(formGroup4);
        form.append($("<h4>", { class: "text-center", html: "Ingredients" }));
        form.append($("<hr>"));
        form.append(formGroupMeat);
        form.append(moreMeatButton);
        form.append(formGroupCuring);
        form.append(moreCuringButton);
        form.append(formGroupAromatics);
        form.append(moreAromaticsButton);
        form.append($("<h4>", { class: "text-center", html: "Steps" }));
        form.append($("<hr>"));
        form.append(formGroupSteps);
        form.append(moreStepsButton);

        // Add form buttons
        let buttonDiv = $("<div>");
        form.append(buttonDiv);
        buttonDiv.append($("<button>", { type: "submit", class: "btn btn-info btn-block", id: "submitBtn", text: "Submit recipe" }));
        buttonDiv.append($("<button>", { type: "reset", class: "btn btn-danger btn-block", id: "cancelBtn", text: "Cancel" }));

        return box;
    },
    createModal: function () {
        let modal = $("<div>", { class: "modal", tabindex: "-1", id: "recipeModal" });
        let modalDialog = $("<div>", { class: "modal-dialog modal-dialog-centered" });
        let modalContent = $("<div>", { class: "modal-content" });
        let modalHeader = $("<div>", { class: "modal-header" });
        let modalTitle = $("<h5>", { class: "modal-title", text: "Recipe added!" });
        let xButton = $("<button>", { type: "button", class: "close", dataDismiss: "modal", ariaLabel: "Close" });
        let xSpan = $("<span>", { ariaHidden: "true", html: "&times;" });
        xSpan.on("click", function () {
            $("#recipeModal").modal("hide");
            recipePageConstruction.loadPage(sessionStorage.userType);            
        });
        let modalBody = $("<div>", { class: "modal-body" });
        let modalText = $("<p>", { text: "New recipe successfully added" });
        let modalFooter = $("<div>", { class: "modal-footer" });
        let button = $("<button>", { type: "button", class: "btn btn-info", dataDismiss: "modal", ariaLabel: "Close", text: "Return" });
        button.on("click", function () {
            $("#recipeModal").modal("hide");
            recipePageConstruction.loadPage(sessionStorage.userType);            
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
    configureNav: function () {
        $("#homeNavLink").removeClass("active");
        $("#loginNavLink").removeClass("active");
        $("#loginNavLink").hide();
        $("#registerNavLink").hide();
        $("#recipesNavLink").show();
        $("#recipesNavLink").removeClass("active");
        $("#recipesNavLink").on("click", function () {
            recipePageConstruction.loadPage(sessionStorage.userType);
        });
        $("#addNewNavLink").addClass("active");
        $("#logoutNavLink").show();
        $("#logoutNavLink").on("click", function () {
            localStorage.removeItem("authenticated");
            sessionStorage.removeItem("authenticated");
            landingPage.loadPage();
        });
    }
};


export { addRecipePageConstruction };