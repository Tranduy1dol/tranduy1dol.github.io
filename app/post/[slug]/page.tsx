import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import GetPostMetadata from "../components/getPostMetadata";

const getPostContent = (slug: string) => {
    const folder = "posts/"
    const file = `${folder}${slug}.md`
    const content = fs.readFileSync(file, "utf-8");
    const matterResult = matter(content)
    return matterResult;
}

export const generateStaticParams = async () => {
    const posts = GetPostMetadata();
    return posts.map(post => ({
        slug: post.slug
    }))
}

const PostPage = (props: any) => {
    const slug = props.params.slug;
    const post = getPostContent(slug);
    return (
        <div>
            <Markdown>{post.content}</Markdown>
        </div>
    )
}

export default PostPage;