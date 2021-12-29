const mongoose = require("mongoose")
const Joi = require("joi")
const JoiObjectId = require("joi-objectid")
Joi.objectId = JoiObjectId(Joi)

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
})

const placeSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  website: String,
  ratings: [ratingSchema],

  photos: [String],
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
  type: {
    type: String,
    enum: ["Restaurant", "Museum", "Mall", "Hotel", "TouristPlace", "Event"],
  },
  city: {
    type: mongoose.Types.ObjectId,
    ref: "City",
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
})

const placeAddJoi = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(2).max(1000).required(),
  location: Joi.string().min(1).max(1000).required(),
  website: Joi.string().min(1).max(1000).required(),
  photos: Joi.array().items(Joi.string().uri()).min(1).max(100).required(),
  products: Joi.array().items(Joi.objectId()),
  city: Joi.objectId(),

  type: Joi.string().valid("Restaurant", "Museum", "Mall", "Hotel", "TouristPlace", "Event").required(),
})

const placeEditJoi = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().min(2).max(1000),
  location: Joi.string().min(1).max(1000),
  website: Joi.string().min(1).max(1000),
  photos: Joi.array().items(Joi.string().uri()).min(1).max(100),
  products: Joi.array().items(Joi.objectId()),
})

const Place = mongoose.model("Place", placeSchema)

module.exports.Place = Place
module.exports.placeAddJoi = placeAddJoi
module.exports.placeEditJoi = placeEditJoi
