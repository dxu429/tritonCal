var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
  // fields are defined here
  "id": String,
  "name": String, 
  "first_name": String,
  "email": String
});

var GroupSchema = new Mongoose.Schema({
  "id": String,
  "name": String,
  "email": String
});

var UserGroupsSchema = new Mongoose.Schema({
  "user_id": String,
  "group_id": String
});

exports.User = Mongoose.model('User', UserSchema);
exports.Group = Mongoose.model('Group', GroupSchema);
exports.UserGroups = Mongoose.model('UserGroups', UserGroupsSchema);
