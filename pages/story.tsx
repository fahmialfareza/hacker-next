import Error from "next/error";
import axios from "axios";
import Layout from "../components/Layout";
import CommentList from "../components/CommentList";
import { NextPage, NextPageContext } from "next";

interface Comment {
  id: number;
  user: string;
  content: string;
  time_ago: string;
  comments: Comment[];
}

interface StoryData {
  id: number;
  title: string;
  url: string;
  points?: number;
  comments_count?: number;
  time_ago: string;
  comments: Comment[];
}

interface StoryProps {
  story: StoryData | null;
}

const Story: NextPage<StoryProps> = ({ story }) => {
  if (!story) {
    return <Error statusCode={503} />;
  }

  return (
    <Layout title={story.title} backButton={true}>
      <main>
        <h1 className="story-title">
          <a href={story.url}>{story.title}</a>
        </h1>

        <div className="story-details">
          <strong>{story.points} points</strong>
          <strong>{story.comments_count} comments</strong>
          <strong>{story.time_ago}</strong>
        </div>

        {story.comments.length > 0 ? (
          <CommentList comments={story.comments} />
        ) : (
          <div>No comments for this story</div>
        )}
      </main>

      <style jsx>{`
        main {
          padding: 1em;
        }
        .story-title {
          font-size: 1.2rem;
          margin: 0;
          font-weight: 300;
          padding-bottom: 0.5em;
        }
        .story-title a {
          color: #333;
          text-decoration: none;
        }
        .story-title a:hover {
          text-decoration: underline;
        }
        .story-details {
          font-size: 0.8rem;
          padding-bottom: 1em;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 1em;
        }
        .story-details strong {
          margin-right: 1em;
        }
        .story-details a {
          color: #f60;
        }
      `}</style>
    </Layout>
  );
};

// Modify `getInitialProps` to accept NextPageContext and handle query parsing
Story.getInitialProps = async ({ query }: NextPageContext) => {
  const storyId = query.id as string | undefined; // Cast to string | undefined
  let story: StoryData | null = null;

  if (storyId) {
    try {
      const response = await axios.get(
        `https://node-hnapi.herokuapp.com/item/${storyId}`
      );
      story = response.data;
    } catch (err) {
      console.log(err);
      story = null;
    }
  }

  return { story };
};

export default Story;
