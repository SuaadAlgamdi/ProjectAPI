const express = require("express")
const checkAdmin = require("../middlewere/checkAdmin")
const validateBody = require("../middlewere/validateBody")
const { Place } = require("../models/Place")
const router = express.Router()
const { Product, productJoi, productEditJoi } = require("../models/Product")

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "place",
      populate: "city",
    })
    res.json(products)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.post("/:placeId", checkAdmin, validateBody(productJoi), async (req, res) => {
  const { name, price, photo, description } = req.body

  const nawProductes = new Product({
    name,
    photo,
    price,
    description,
    place: req.params.placeId,
  })
  await nawProductes.save()
  await Place.findByIdAndUpdate(req.params.placeId, { $push: { products: nawProductes._id } })
  res.json(nawProductes)
})

router.put("/:placeId", checkAdmin, validateBody(productEditJoi), async (req, res) => {
  try {
    const productNew =
      ({ name, price, description, photos } =
      req.body =
        await Place.findByIdAndUpdate(req.params.placeId, {
          $set: {
            name,
            price,
            description,
            photos,
          },
        }))

    res.json(productNew)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.delete("/:productId", async (req, res) => {
  const products = await Product.findByIdAndRemove(req.params.productId)
  if (!products) return res.status(404).send("product not found")
  res.json("product is removed")
})

module.exports = router
