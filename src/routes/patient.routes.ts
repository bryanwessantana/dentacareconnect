import { Router } from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
} from '../controllers/patient.controller';

const router = Router();

// POST /api/patients - Create a new patient
router.post('/', createPatient);

// GET /api/patients - List all patients (with search & pagination)
router.get('/', getAllPatients);

// GET /api/patients/:id - Get patient details by ID
router.get('/:id', getPatientById);

// PUT /api/patients/:id - Update patient profile
router.put('/:id', updatePatient);

export default router;
