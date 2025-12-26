import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const spotlightDirectory = path.join(process.cwd(), '_content/spotlight');

export type SpotlightData = {
    id: string;
    title: string;
    description: string;
    link: string;
    image?: string;
    category?: string;
    order?: number;
};

export function getSpotlightProjects(): SpotlightData[] {
    // Ensure directory exists
    if (!fs.existsSync(spotlightDirectory)) {
        fs.mkdirSync(spotlightDirectory, { recursive: true });
        return [];
    }

    const fileNames = fs.readdirSync(spotlightDirectory);
    const mdFiles = fileNames.filter(file => file.endsWith('.md'));

    if (mdFiles.length === 0) {
        return [];
    }

    const allProjects = mdFiles.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(spotlightDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            title: matterResult.data.title,
            description: matterResult.data.description,
            link: matterResult.data.link,
            image: matterResult.data.image,
            category: matterResult.data.category,
            order: matterResult.data.order || 0,
        };
    });

    // Sort by order (lower first), then by title
    return allProjects.sort((a, b) => {
        if (a.order !== b.order) {
            return (a.order || 0) - (b.order || 0);
        }
        return a.title.localeCompare(b.title);
    });
}
