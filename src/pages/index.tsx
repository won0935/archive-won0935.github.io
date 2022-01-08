import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import Bio from '../components/Bio';
import CategoryMenu from '../components/CategoryMenu';
import HomeJsonLd from '../components/json/HomeJsonLd';
import Layout from '../components/Layout';
import MainWrapper from '../components/MainWrapper';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import { QueryResult } from '../models';

interface Props {
  data: QueryResult;
  location: any;
}
class BlogIndex extends React.Component<Props> {
  render() {
    const { data } = this.props;
    const categories = data.site.siteMetadata.categories;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;
    const { location } = this.props;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="" />
        <Helmet>
          <link rel="canonical" href="https://wwlee94.github.io" />
          <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.min.css" />
        </Helmet>
        <HomeJsonLd />
        <MainWrapper category={Category({ location, categories })} posts={Posts({ posts })} bio={<Bio />} tableOfContents={null} />
      </Layout>
    );
  }
}

export default BlogIndex;

const Category = ({ location, categories }: any) => {
  return <CategoryMenu location={location} categories={categories} />;
};

const Posts = ({ posts }: any) => {
  return posts.map(({ node }: any) => {
    return <PostCard key={node.fields.slug} node={node} />;
  });
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        categories {
          name
          icon
          link
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY.MM.DD")
            title
            emoji
            category
          }
        }
      }
    }
  }
`;
