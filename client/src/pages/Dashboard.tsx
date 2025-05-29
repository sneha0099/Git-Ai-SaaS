// src/components/DashboardMain.tsx
import { Button } from '@/components/ui/button';
import useProject from '@/hooks/use-project';
import { ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { project } = useProject();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="w-fit rounded-md bg-primary px-3 py-3">
                    <div className="flex items-center">
                        <Github className="h-5 w-5 text-white" />
                        <div className="ml-2">
                            <p className="text-sm font-medium text-white">
                                This project is linked to{' '}
                                <Link
                                    className="inline-flex items-center text-gray-300 hover:underline"
                                    to={project?.gitUrl || '#'}
                                >
                                    {project?.gitUrl}
                                    <ExternalLink className="ml-1 h-4 w-4" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-x-2">
                    <Button>Invite a team member!</Button>
                    <Button variant="outline">Archive</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Ask a question</h2>
                    <input
                        type="text"
                        className="border p-2 w-full rounded"
                        placeholder="Which file should I edit to change the home page?"
                    />
                    <Button className="mt-2 w-full">Ask GitGinie!</Button>
                </div>

                <div className="bg-white p-4 rounded shadow flex flex-col items-center justify-center">
                    <p className="mb-2">Create a new meeting</p>
                    <Button>Upload Meeting</Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <ul className="space-y-2">
                    <li>
                        <strong>Elliott Chong</strong> committed —{' '}
                        <em>Update README.md</em>
                        <p className="text-sm text-gray-500">
                            * Added a test change to the README file.
                        </p>
                    </li>
                    <li>
                        <strong>Elliott Chong</strong> merged PR —{' '}
                        <em>Update typos on homepage</em>
                        <p className="text-sm text-gray-500">
                            * Fixed a typo in the marketing text of the
                            homepage.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
