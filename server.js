// Bring in the express server and create application
let express = require('express');
let app = express();
let cors = require('cors');
const fileUpload = require('express-fileupload');
let bodyParser = require('body-parser');
let recipeRepo = require('./repos/reciperepo');
let userRepo = require('./repos/user-repo');
let errorHelper = require('./helpers/errorhelpers');

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data parsing in request object
app.use(express.json());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// Configure CORS
app.use(cors());

// Configure file uploads
app.use(fileUpload());


// Create GET to return a list of all recipies
router.get('/', function (req, res, next) {
    recipeRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All recipes retrieved",
            "data": data
        });
    }, function (err) {
        next(err);
    });
});

// Create GET/category to return all recipes in that category
router.get('/category/:category', function (req, res, next) {
    recipeRepo.getByCategory(req.params.category, function (data) {
        if (data.length != 0) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All recipes in category: '" + req.params.category + "' retrieved",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The recipes in category '" + req.params.category + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The recipes in category '" + req.params.category + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

// Create GET/difficulty to return all recipes in a difficulty type
router.get('/difficulty/:difficulty', function (req, res, next) {
    recipeRepo.getByDifficulty(req.params.difficulty, function (data) {
        if (data.length != 0) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All recipes in difficulty: '" + req.params.difficulty + "' retrieved",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The recipes in category '" + req.params.difficulty + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The recipes in category '" + req.params.difficulty + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

// Create GET/difficulty to return all recipes in a difficulty type
router.get('/type/:type', function (req, res, next) {
    recipeRepo.getByType(req.params.type, function (data) {
        if (data.length != 0) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All recipes in type: '" + req.params.type + "' retrieved",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The recipes in type '" + req.params.type + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The recipes in type '" + req.params.type + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

// Create GET/search?id=n&name=str to search for recipes by "id" and/or "name"
router.get('/search', function (req, res, next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };
    recipeRepo.search(searchObject, function (data) {
        if (data.length != 0) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All matching recipes retrieved",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The search for ID '" + searchObject.id + "' and / or name '" + searchObject.name + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The search for ID '" + searchObject.id + "' and / or name '" + searchObject.name + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

// Create GET/id to return a single recipe
router.get('/:id', function (req, res, next) {
    recipeRepo.getById(req.params.id, function (data) {
        if (data) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "Single recipe retrieved",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The recipe '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The recipe '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.post('/', urlencodedParser, function (req, res, next) {
    console.dir("Server.js req.body #" + req.body);
    recipeRepo.insert(req.body, function (data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New Recipe Added",
            "data": data
        });
    }, function (err) {
        next(err);
    });
});

router.put('/:id', function (req, res, next) {
    recipeRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to update the data
            recipeRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Recipe ID: '" + req.params.id + "' updated",
                    "data": data
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The recipe '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The recipe '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.delete('/:id', function (req, res, next) {
    recipeRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to delete the data
            recipeRepo.delete(req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "The recipe '" + req.params.id + "' is deleted",
                    "data": data
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The recipe '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The recipe '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.patch('/:id', function (req, res, next) {
    recipeRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to update the data
            recipeRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "The recipe '" + req.params.id + "' is patched",
                    "data": data
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The recipe '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The recipe '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.post('/login', urlencodedParser, function (req, res, next) {
    userRepo.getByUsername(req.body, function (data) {
        console.log(data);
        if (data) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "Successfully logged in",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The user '" + req.body + "' does not exist",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The user '" + req.body + "' does not exist"
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.post('/users', urlencodedParser, function (req, res, next) {
    console.dir(req.body);
    userRepo.insert(req.body, function (data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New User Added",
            "data": data
        });

        res.end();
    }, function (err) {
        next(err);
    });
});

// Allow images to be uploaded
router.post('/file', function (req, res, next) {
    console.log(req.files.myFile);
    const f = req.files.myFile;
    res.set('Content-Type', 'text/html');
    f.mv('./public/images/' + f.name);
    res.send(
     console.log("Success")
    );
});

// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

// Configure exception logger to console
app.use(errorHelper.logErrorsToConsole);
// Configure exception logger to file
app.use(errorHelper.logErrorsToFile);
// Configure client error handler
app.use(errorHelper.clientErrorHandler);
// Configure catch-all exception middleware
app.use(errorHelper.errorHandler);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create server to listen on port 8081
let server = app.listen(8081, function () {
    console.log('Node server is running on http://localhost:8081..');
});

