import { Octokit } from 'octokit';

export const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
});

type Response = {
    commitMessage: string;
    commitHashe: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
};

export const getCommitHashes = async (
    githubUrl: string
): Promise<Response[]> => {};
