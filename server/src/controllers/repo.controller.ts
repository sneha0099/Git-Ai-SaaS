import prisma from '../config/prismaClient';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { projectName, projectUrl, githubToken } = req.body;

        if (!req.user) {
            throw new ApiError(401, 'User not authenticated');
        }

        const project = await prisma.project.create({
            data: {
                name: projectName,
                gitUrl: projectUrl,
                githubToken,
            },
        });

        await prisma.userToProject.create({
            data: {
                userId: req.user.id,
                projectId: project.id,
            },
        });

        res.status(201).json(
            new ApiResponse(201, project, 'Project created successfully')
        );
    } catch (error) {
        next(error);
    }
};
