const mongoose = require('mongoose');
const Client = require('../models/schemas/client');
const Schemas = require('../models/schemas/storeConfig');

const { storeConfigSchema } = Schemas;

module.exports.getLoggedUsers = function (req, res, next) {
  const StoreConfig = mongoose.model(
    'StoreConfig',
    storeConfigSchema,
    `${req.headers['x-mongo-key']}_StoreConfig`,
  );
  StoreConfig.findOne(
    { mongoKey: req.headers['x-mongo-key'] },
    (err, storeConfig) => {
      console.log('StoreConfig Found:');
      console.log(storeConfig);
      if (err) next(err);
      return res.json(storeConfig);
    },
  );
};

module.exports.pushLoggedUser = function (req, res, next) {
  console.log('pushLoggedUser Triggered');
  console.log('Should have a req.body.name:');
  console.log(req.body.name);
  const StoreConfig = mongoose.model(
    'StoreConfig',
    storeConfigSchema,
    `${req.headers['x-mongo-key']}_StoreConfig`,
  );
  StoreConfig.findOneAndUpdate(
    { mongoKey: req.headers['x-mongo-key'] },
    { $addToSet: { loggedInUsers: req.body.name } },
    { upsert: true, new: true },
    (err, newStoreConfig) => {
      if (err) next(err);
      console.log('Logged In Users Array Updated - ');
      console.log(newStoreConfig);
      res.send(req.body.timeSheet);
    },
  );
};

module.exports.pullLoggedUser = function (req, res, next) {
  console.log('Pulling clocked out user from Logged Users Array');
  console.log('Should have a req.body.name:');
  console.log(req.body.name);
  const StoreConfig = mongoose.model(
    'StoreConfig',
    storeConfigSchema,
    `${req.headers['x-mongo-key']}_StoreConfig`,
  );
  StoreConfig.findOneAndUpdate(
    { mongoKey: req.headers['x-mongo-key'] },
    { $pull: { loggedInUsers: req.body.name } },
    { new: true },
    (err, newStoreConfig) => {
      console.log('User has been pulled - New Store Config:');
      console.log(newStoreConfig);
      console.log("Sending User's Timesheet to Client Via Response");
      res.send(req.body.timeSheet);
    },
  );
};
