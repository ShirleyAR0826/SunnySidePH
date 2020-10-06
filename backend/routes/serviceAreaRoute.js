import express from 'express';
import ServiceArea from '../models/serviceAreaModel.js';
import { isAuth, isAdmin } from '../util.js';

const router = express.Router();

router.get("/", async (req, res) => {
  const city = req.query.city? {city: req.query.city} : {};
  const serviceAreas = await ServiceArea.find({...city});
  res.send(serviceAreas);
});

router.post('/', isAuth, isAdmin, async (req, res) => {
  const serviceArea = new ServiceArea({
    city: req.body.city,
    barangay: req.body.barangay,
    lalamoveMotorcycleFee: req.body.lalamoveMotorcycleFee,
    lalamoveMPVFee: req.body.lalamoveMPVFee,
  });
  const newServiceArea = await serviceArea.save();
  if (newServiceArea) {
    return res
      .status(201)
      .send({ message: 'New Service Area Created', data: newServiceArea });
  }
  return res.status(500).send({ message: ' Error in Creating Service Area.' });
});

router.put('/:id', isAuth, isAdmin, async (req, res) => {
  const serviceAreaId = req.params.id;
  const serviceArea = await ServiceArea.findById(serviceAreaId);
  if (serviceArea) {
    serviceArea.city = req.body.city;
    serviceArea.barangay = req.body.barangay;
    serviceArea.lalamoveMotorcycleFee = req.body.lalamoveMotorcycleFee;
    serviceArea.lalamoveMPVFee = req.body.lalamoveMPVFee;
    const updatedServiceArea = await serviceArea.save();
    if (updatedServiceArea) {
      return res
        .status(200)
        .send({ message: 'Service Area Updated', data: updatedServiceArea });
    }
  }
  return res.status(500).send({ message: ' Error in Updating Service Area.' });
});

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  const deletedServiceArea = await ServiceArea.findById(req.params.id);
  if (deletedServiceArea) {
    await deletedServiceArea.remove();
    res.send({ message: 'Service Area Deleted' });
  } else {
    res.send('Error in Deletion.');
  }
});

export default router;