const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const omniUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },

    firstName: String,
    lastName: String,
    phone: String,

    hash: { type: String, required: true },
    accountType: String,
    role: String,

    avatarURL: String,

    isMaster: Boolean,
    master_id: { type: Schema.Types.ObjectId, ref: 'OmniUser' },

    mongoCollectionKey: { type: String, index: true, required: true },

    terminalIDNumber: Number,

    isAdmin: Boolean,

    employeeCounter: Number,

    token: String,
    tokenCreatedAt: Date,
  },
  {
    toObject: { getters: true },
  },
);

const essosUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },

    accountType: String,
    avatarURL: String,

    firstName: String,
    lastName: String,
    phone: String,

    billing_address_line1: String,
    billing_address_line2: String,
    billing_address_city: String,
    billing_address_zip: String,
    billing_address_state: String,
    shipping_address_line1: String,
    shipping_address_line2: String,
    shipping_address_city: String,
    shipping_address_zip: String,
    shipping_address_state: String,

    mongoCollectionKey: { type: String, index: true, required: true },

    token: String,
    tokenCreatedAt: Date,

    marketplaceRef_id: {
      type: Schema.Types.ObjectId,
      ref: 'Marketplace',
    },

    followers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'EssosUser' },
        name: String,
        avatarURL: String,
      },
    ],

    following: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'EssosUser' },
        name: String,
        avatarURL: String,
      },
    ],

    wishlist: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: 'StoreItem' },
        itemName: String,
        postedBy: String,
        imageURL: String,
      },
    ],
  },
  {
    toObject: { getters: true },
  },
);

const verifyPassword = (password, next) => {
  bcrypt.compare(password, this.hash, (err, pwMatches) => {
    if (err) return next(err);
    next(null, pwMatches);
  });
};

omniUserSchema.methods.comparePassword = verifyPassword;
essosUserSchema.methods.comparePassword = verifyPassword;

module.exports.OmniUser = mongoose.model('OmniUser', omniUserSchema);
module.exports.EssosUser = mongoose.model(
  'EssosUser',
  essosUserSchema,
);
