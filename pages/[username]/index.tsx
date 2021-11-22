import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postsToJSON } from "../../lib/firebase";

export const getServerSideProps = async ({ query }) => {
  const { username } = query,
    userDoc = await getUserWithUsername(username);
  let user = null,
    posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection(`posts`)
      .where(`published`, `==`, true)
      .orderBy(`createdAt`, `desc`)
      .limit(5);

    posts = (await postsQuery.get()).docs.map(postsToJSON);
  }
  return {
    props: { user, posts },
  };
};

const UsernamePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  );
};

export default UsernamePage;
