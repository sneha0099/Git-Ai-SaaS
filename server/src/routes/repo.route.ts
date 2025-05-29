import express from 'express';
import validate from '../middlewares/validate.middleware';
import { createProject, getProjects } from '../controllers/repo.controller';
import { createRepoSchema } from '../validators/repoSchema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post(
    '/create-project',
    authMiddleware,
    validate(createRepoSchema),
    createProject
);

router.get('/get-projects', authMiddleware, getProjects);

export default router;
