const getPostContent = (slug: string) => {
    const folder = "posts/"
    const file = `${folder}${slug}.md`
    return fs.readFileSync(file, "utf-8");
}

const PostPage = (props: any) => {
    const slug = props.params.slug;
    const content = getPostContent(slug);
    return (
        <p>
            <h1>This is a post: {slug}</h1>
            <p>{content}</p>
        </p>
    )
}

export default PostPage;