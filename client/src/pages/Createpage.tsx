import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProject } from '@/services/repoService';
import { createRepoSchema } from '@/types/repoSchema';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

function Createpage() {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } =
        useForm<z.infer<typeof createRepoSchema>>();

    const mutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project created successfully!');
            reset();
        },
        onError: (error: any) => {
            console.error('Error creating project:', error);
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    'Failed to create project'
            );
        },
    });

    async function onSubmit(data: z.infer<typeof createRepoSchema>) {
        mutation.mutate(data);
    }

    return (
        <div className="flex items-center gap-12 h-full justify-center">
            <img src="/create.png" alt="create" width={400} height={400} />
            <div>
                <div>
                    <h1 className="font-semibold text-2xl">
                        Link your GitHub repository
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the URL of your repository to link it to GitGinie.
                    </p>
                </div>
                <div className="h-4"></div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            {...register('projectName', { required: true })}
                            placeholder="Project Name"
                            required
                        />

                        <div className="h-2"></div>

                        <Input
                            {...register('projectUrl', { required: true })}
                            placeholder="GitHub repository URL"
                            type="url"
                            required
                        />

                        <div className="h-2"></div>

                        <Input
                            {...register('githubToken')}
                            placeholder="GitHub token (optional)"
                        />

                        <div className="h-2"></div>

                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? 'Creating...'
                                : 'Create Project'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Createpage;
