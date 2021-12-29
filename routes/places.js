const express = require("express")
const router = express.Router()
const checkAdmin = require("../middlewere/checkAdmin")
const checkToken = require("../middlewere/checkToken")
const validateBody = require("../middlewere/validateBody")
const validteId = require("../middlewere/validteId")
const { City } = require("../models/City")
const { User } = require("../models/User")

const { commentJoi, Comment } = require("../models/Comment")

const { Place, placeAddJoi, placeEditJoi } = require("../models/Place")

router.get("/", async (req, res) => {
  try {
    const places = await Place.find().populate("products").populate("comments").populate("city")
    res.json(places)
  } catch (error) {
    res.json(error.message)
    console.log(error.message)
  }
})

router.post("/:cityId", checkAdmin, validateBody(placeAddJoi), async (req, res) => {
  try {
    const { name, description, location, website, products, photos, type } = req.body

    const placeNaw = new Place({
      name,
      description,
      location,
      website,
      products,
      type,
      photos,
      city: req.params.cityId,
    })
    await placeNaw.save()
    // لان ه

    if (type == "Rastorant") await City.findByIdAndUpdate(req.params.cityId, { $push: { restaurants: placeNaw._id } })
    if (type == "Museum") await City.findByIdAndUpdate(req.params.cityId, { $push: { museums: placeNaw._id } })
    if (type == "Mall") await City.findByIdAndUpdate(req.params.cityId, { $push: { malls: placeNaw._id } })
    if (type == "Hotel") await City.findByIdAndUpdate(req.params.cityId, { $push: { hotels: placeNaw._id } })
    if (type == "TouristPlace")
      await City.findByIdAndUpdate(req.params.cityId, { $push: { touristPlaces: placeNaw._id } })
    if (type == "Event") await City.findByIdAndUpdate(req.params.cityId, { $push: { events: placeNaw._id } })

    res.json(placeNaw)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.put("/:placeId", checkAdmin, validateBody(placeEditJoi), async (req, res) => {
  try {
    const { name, description, location, website, products, photos } = req.body

    const placeNaw = await Place.findByIdAndUpdate(
      req.params.placeId,
      {
        $set: {
          //تعديل
          name,
          description,
          location,
          website,
          products,
          photos,
        },
      },
      { new: true }
    )
    if (!placeNaw) return res.status(404).send("place not faund")

    res.json(placeNaw)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.delete("/:placeId", checkAdmin, async (req, res) => {
  const plase = await Place.findByIdAndRemove(req.params.placeId)
  if (!plase) return res.status(404).send("place not faund")
  res.send("places removed")
})

//-------------------------------------------------------------------------------get comment
router.get("/:placeId/comments", validteId("placeId"), async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId).populate("comments")
    if (!place) return res.status(404).send("place not found")

    const comments = await Comment.find({ placeId: req.params.placeId })
    res.json(comments)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//----------------------------------------------------post comment---------------------------------------------------
router.post("/:placeId/comments", checkToken, validteId("placeId"), validateBody(commentJoi), async (req, res) => {
  try {
    const { comment } = req.body
    const place = await Place.findById(req.params.placeId)
    if (!place) return res.status(404).send("place not found")

    const newComment = new Comment({ comment, owner: req.userId, placeId: req.params.placeId })

    await Place.findByIdAndUpdate(req.params.placeId, { $push: { comments: newComment._id } })

    await newComment.save()
    res.json(newComment)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.put(
  "/:placeId/comments/:commentId",
  checkToken,
  validteId("placeId", "commentId"),
  validateBody(commentJoi),

  async (req, res) => {
    try {
      const place = await Place.findById(req.params.placeId)
      if (!place) return res.status(404).send("place not found")
      const { comment } = req.body

      const commentFound = await Comment.findById(req.params.commentId)
      if (!commentFound) return res.status(404).send("comment not found")

      if (commentFound.owner != req.userId) return res.status(403).send("unauthorized action")

      const updtedComment = await Comment.findByIdAndUpdate(req.params.commentId, { $set: { comment } }, { new: true })

      res.json(updtedComment)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
    }
  }
)
router.delete("/:placeId/comments/:commentId", checkToken, validteId("placeId", "commentId"), async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId)
    if (!place) return res.status(404).send("place not found")

    const commentFound = await Comment.findById(req.params.commentId)
    if (!commentFound) return res.status(404).send("comment not found")

    const user = await User.findById(req.userId)

    if (user.role !== "Admin" && commentFound.owner != req.userId) return res.status(403).send("unauthorized action")

    await Place.findByIdAndUpdate(req.params.placeId, { $pull: { comments: commentFound._id } })

    await Comment.findOneAndRemove(req.params.commentId)

    res.send("comment is removed")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

module.exports = router
