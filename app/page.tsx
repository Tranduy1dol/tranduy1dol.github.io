import Link from "next/link";
import GetPostMetadata from "../components/getPostMetadata";
import PostPreview from "../components/PostPreview";

const HomePage = () => {
    const posts = GetPostMetadata();
    const postPreview = posts.map(posts => (
        <PostPreview key = {posts.slug} {...posts}/>
    ))
    return <div>{postPreview}</div>
}

export default HomePage;