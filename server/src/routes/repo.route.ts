import express from 'express';
import validate from '../middlewares/validate.middleware';
import { createProject } from '../controllers/repo.controller';
import { createRepoSchema } from '../validators/repoSchema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post(
    '/create-project',
    authMiddleware,
    validate(createRepoSchema),
    createProject
);

export default router;
