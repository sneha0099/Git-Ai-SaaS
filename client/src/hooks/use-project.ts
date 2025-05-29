import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/repoService';
import { useLocalStorage } from 'usehooks-ts';

const useProject = () => {
    const { data } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    });
    const projects = data?.data || [];

    const [projectId, setProjectId] = useLocalStorage<string | null>(
        'git-projectIds',
        null
    );

    const project = projects?.find((project) => project.id === projectId);

    return {
        projects,
        project,
        setProjectId,
        projectId,
    };
};

export default useProject;
