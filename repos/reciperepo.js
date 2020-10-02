let fs = require('fs');
const FILE_NAME = './assets/recipes.json';

let recipeRepo = {
    get: function (resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    },
    getById: function (id, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipe = JSON.parse(data).find(r => r.id == id);
                resolve(recipe);
            }
        });
    },
    getByCategory: function (category, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipes = JSON.parse(data).filter(r => r.category.toLowerCase() == category.toLowerCase());
                resolve(recipes);
            }
        });
    },
    getByDifficulty: function (difficulty, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipes = JSON.parse(data).filter(r => r.difficulty.toLowerCase() == difficulty.toLowerCase());
                resolve(recipes);
            }
        });
    },
    getByType: function (type, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipes = JSON.parse(data).filter(r => r.type.toLowerCase() == type.toLowerCase());
                resolve(recipes);
            }
        });
    },
    search: function (searchObject, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipes = JSON.parse(data);
                // Perform search
                if (searchObject) {
                    recipes = recipes.filter(
                        r => (searchObject.id ? r.id == searchObject.id : true) &&
                            (searchObject.name ? r.name.toLowerCase().indexOf(searchObject.name.toLowerCase()) >= 0 : true));
                }
                resolve(recipes);
            }
        });
    },
    insert: function (newData, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipes = JSON.parse(data);
                if (recipes.find(u => u.name.toLowerCase() == newData.name.toLowerCase())) {
                    reject(err);
                }
                else {
                    // Make a new object to create the ID
                    let newRecipe;
                    if (newData.image) {
                        let backSlash = newData.image.lastIndexOf("\\");
                        let image = newData.image.substr(backSlash + 1);
                        newRecipe = {
                            id: recipes.length + 1,
                            name: newData.name,
                            category: newData.category,
                            type: newData.type,
                            difficulty: newData.difficulty,
                            image: image,
                            ingredients: {
                                meat: newData.ingredients.meat,
                                curingIngredients: newData.ingredients.curingIngredients,
                                aromatics: newData.ingredients.aromatics
                            },
                            steps: newData.steps
                        };
                    }
                    else {
                        newRecipe = {
                            id: recipes.length + 1,
                            name: newData.name,
                            category: newData.category,
                            type: newData.type,
                            difficulty: newData.difficulty,
                            ingredients: {
                                meat: newData.ingredients.meat,
                                curingIngredients: newData.ingredients.curingIngredients,
                                aromatics: newData.ingredients.aromatics
                            },
                            steps: newData.steps
                        };
                    }

                    recipes.push(newRecipe);
                    fs.writeFile(FILE_NAME, JSON.stringify(recipes), function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(newData);
                        }
                    });
                }
            }
        });
    },
    update: function (newData, id, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipes = JSON.parse(data);
                let recipe = recipes.find(r => r.id == id);
                if (recipe) {
                    Object.assign(recipe, newData);
                    fs.writeFile(FILE_NAME, JSON.stringify(recipes), function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(newData);
                        }
                    });
                }
            }
        });
    },
    delete: function (id, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let recipes = JSON.parse(data);
                let index = recipes.findIndex(r => r.id == id);
                if (index != -1) {
                    recipes.splice(index, 1);
                    fs.writeFile(FILE_NAME, JSON.stringify(recipes), function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(index);
                        }
                    });
                }
            }
        });
    }
};

module.exports = recipeRepo;