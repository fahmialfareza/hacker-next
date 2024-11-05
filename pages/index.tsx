import React from "react";
import Error from "next/error";
import Link from "next/link";
import axios from "axios";
import StoryList from "../components/StoryList";
import Layout from "../components/Layout";

interface Story {
  id: number;
  title: string;
  url: string;
  points?: number;
  comments_count?: number;
}

interface IndexProps {
  stories: Story[];
  page: number;
}

class Index extends React.Component<IndexProps> {
  static async getInitialProps({ query }: { query: { page?: string } }) {
    let stories: Story[] = [];
    // Parse the page number and default to 1 if not provided
    const page = Number(query.page) || 1;

    try {
      const response = await axios.get(
        `https://node-hnapi.herokuapp.com/news?page=${page}`
      );
      stories = response.data;
    } catch (err) {
      console.log(err);
      stories = [];
    }

    return { page, stories };
  }

  componentDidMount() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("service worker registration successful", registration);
        })
        .catch((err) => {
          console.warn("service worker registration failed", err.message);
        });
    }
  }

  render() {
    const { stories, page } = this.props;

    if (stories.length === 0) {
      return <Error statusCode={503} />;
    }

    return (
      <Layout
        title="Hacker Next"
        description="A Hacker News clone made with Next.js"
      >
        <StoryList stories={stories} />

        <footer>
          <Link href={`/?page=${page + 1}`}>
            <a>Next Page ({page + 1})</a>
          </Link>
        </footer>

        <style jsx>{`
          footer {
            padding: 1em;
          }
          footer a {
            font-weight: bold;
            color: black;
            text-decoration: none;
          }
        `}</style>
      </Layout>
    );
  }
}

export default Index;
