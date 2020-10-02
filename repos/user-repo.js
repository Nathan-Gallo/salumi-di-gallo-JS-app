let fs = require('fs');
let passwordHash = require('password-hash');
const FILE_NAME = './assets/users.json';

function hashPassword(password) {
    let hashedPassword = passwordHash.generate(String(password));
    return hashedPassword;
}

let userRepo = {
    getByUsername: function (userData, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let users = JSON.parse(data);
                let user = users.find(u => u.username.toLowerCase() == userData.username.toLowerCase());
                if (user) {
                    if (passwordHash.verify(userData.password, user.password)) {
                        resolve(user);
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    reject(err);
                }
            }
        });
    },
    insert: function (newData, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                let users = JSON.parse(data);
                if (users.find(u => u.username.toLowerCase() == newData.username.toLowerCase())) {
                    reject(err);
                }
                else {
                    let hashedPassword = hashPassword(newData.password);
                    let newUser = {
                        id: users.length + 1,
                        type: "user",
                        name: newData.name,
                        username: newData.username,
                        password: hashedPassword
                    };
                    users.push(newUser);
                    fs.writeFile(FILE_NAME, JSON.stringify(users), function (err) {
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
    }
};


module.exports = userRepo;