import { z } from 'zod';

export const createRepoSchema = z.object({
    projectName: z.string().min(1, 'Project name is required'),
    projectUrl: z.string().url('Invalid GitHub URL'),
    githubToken: z.string().optional().nullable(),
});
