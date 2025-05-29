import instance from '@/lib/axios';
import { createRepoSchema } from '@/types/repoSchema';
import { z } from 'zod';

export const createProject = async (data: z.infer<typeof createRepoSchema>) => {
    const response = await instance.post('/repo/create-project', {
        projectName: data.projectName,
        projectUrl: data.projectUrl,
        githubToken: data.githubToken,
    });
    return response.data;
};

export const getProjects = async () => {
    const response = await instance.get('/repo/get-projects');
    return response.data;
};
