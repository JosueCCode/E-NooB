const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const { asyncHandler } = require("../../shared/http/async-handler");
const { validate } = require("../../shared/http/validate");
const { categorySchema } = require("./categories.schemas");
const categoriesService = require("./categories.service");

const categoriesRouter = Router();

categoriesRouter.use(requireAuth);

categoriesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await categoriesService.listCategories(req.user.id);
    res.json({ categories });
  })
);

categoriesRouter.post(
  "/",
  validate(categorySchema),
  asyncHandler(async (req, res) => {
    const category = await categoriesService.createCategory(req.user.id, req.body);
    res.status(201).json({ category });
  })
);

module.exports = { categoriesRouter };
