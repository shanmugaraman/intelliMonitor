const asyncHandler = require('express-async-handler');
const Area = require('../models/Area');

const getAreas = asyncHandler(async (req, res) => {
  const areas = await Area.find({}).sort({ name: 1 });
  res.json(areas);
});

const createArea = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const areaExists = await Area.findOne({ name });

  if (areaExists) {
    res.status(400);
    throw new Error('Area already exists');
  }

  const area = await Area.create({ name, description });
  res.status(201).json(area);
});

const deleteArea = asyncHandler(async (req, res) => {
  const area = await Area.findById(req.params.id);
  if (area) {
    await area.deleteOne();
    res.json({ message: 'Area removed' });
  } else {
    res.status(404);
    throw new Error('Area not found');
  }
});

module.exports = { getAreas, createArea, deleteArea };
