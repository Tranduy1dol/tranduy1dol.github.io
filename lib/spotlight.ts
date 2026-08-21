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
    order?: number;
};

export type BilingualSpotlightData = {
    id: string;
    link: string;
    image?: string;
    order?: number;
    vn: SpotlightData;
    en: SpotlightData;
};

export function getBaseId(fileName: string): string {
    return fileName.replace(/\.vn\.md$/, '').replace(/\.en\.md$/, '').replace(/\.md$/, '');
}

function parseSpotlightFile(fullPath: string, id: string): SpotlightData | null {
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const project: SpotlightData = {
        id,
        title: matterResult.data.title,
        description: matterResult.data.description,
        link: matterResult.data.link,
        order: matterResult.data.order || 0,
    };

    if (matterResult.data.image) {
        project.image = matterResult.data.image;
    }

    return project;
}

export function getSpotlightProjects(): BilingualSpotlightData[] {
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

    const idSet = new Set<string>();
    for (const fileName of mdFiles) {
        idSet.add(getBaseId(fileName));
    }

    const allProjects: BilingualSpotlightData[] = Array.from(idSet).map((id) => {
        let vnData = parseSpotlightFile(path.join(spotlightDirectory, `${id}.vn.md`), id);
        let enData = parseSpotlightFile(path.join(spotlightDirectory, `${id}.en.md`), id);
        const legacyData = parseSpotlightFile(path.join(spotlightDirectory, `${id}.md`), id);

        vnData = vnData || legacyData || enData || ({} as SpotlightData);
        enData = enData || legacyData || vnData || ({} as SpotlightData);

        const base = vnData.link ? vnData : enData;

        return {
            id,
            link: base.link,
            image: base.image,
            order: base.order,
            vn: vnData as SpotlightData,
            en: enData as SpotlightData,
        };
    });

    // Sort by order (lower first), then by title
    return allProjects.sort((a, b) => {
        if (a.order !== b.order) {
            return (a.order || 0) - (b.order || 0);
        }
        return (a.en.title || '').localeCompare(b.en.title || '');
    });
}
