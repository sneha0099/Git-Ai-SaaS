import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
};

function Createpage() {
    const { register, handleSubmit, reset } = useForm<FormInput>();

    function onSubmit(data: FormInput) {
        window.alert(JSON.stringify(data, null, 2));
        return true;
    }
    return (
        <div className="flex items-center gap-12 h-full justify-center">
            <img src='/create.png' alt="create" width={400} height={400} />
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
                            {...register('repoUrl',{ required: true })}
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

                        <Button type="submit">Create Project</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Createpage;
