import { graphql } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import Bio from '../components/Bio';
import CategoryMenu from '../components/CategoryMenu';
import CategoryJsonLd from '../components/json/CategoryJsonLd';
import Layout from '../components/Layout';
import MainWrapper from '../components/MainWrapper';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import { CategoryPageContext, QueryResult } from '../models';

const Heading = styled.h1`
  margin: 0.5em 0 0.8em;
  font-size: 32px;
  transition: all 0.3s ease-in-out 0s; /* 테마 변환 시 애니메이션 */
  color: var(--categoryHeader);
  font-weight: 700;
  line-height: 44px;
  letter-spacing: 1px;
`;

interface Props {
  data: QueryResult;
  pageContext: CategoryPageContext;
  location: any;
}
class CategoryTemplate extends React.Component<Props> {
  render() {
    const { data, pageContext } = this.props;
    const posts = data.allMarkdownRemark.edges;
    const { location } = this.props;
    // get Category name from category slug
    const categorySlug = pageContext.category;
    const categories = data.site.siteMetadata.categories;
    const categoryObject = categories.find(cat => {
      return cat.slug === categorySlug;
    });

    // use slug when name doesn't exist
    const categoryName = categoryObject ? categoryObject.name : categorySlug;

    return (
      <Layout location={this.props.location} title={categoryName}>
        <SEO title={categoryName} />
        <CategoryJsonLd categorySlug={categorySlug} categoryName={categoryName} />
        <MainWrapper category={Category({ location, categories, categoryName })} posts={Posts({ posts })} bio={<Bio />} tableOfContents={null} />
      </Layout>
    );
  }
}

export default CategoryTemplate;

const Category = ({ location, categories, categoryName }: any) => {
  return (
    <React.Fragment>
      <CategoryMenu location={location} categories={categories} />
      <Heading>{categoryName}</Heading>
    </React.Fragment>
  );
};

const Posts = ({ posts }: any) => {
  return posts.map(({ node }: any) => {
    return <PostCard key={node.fields.slug} node={node} />;
  });
};

export const pageQuery = graphql`
  query BlogPostByCategory($category: String) {
    site {
      siteMetadata {
        categories {
          name
          slug
          color
          icon
          link
        }
      }
    }
    allMarkdownRemark(limit: 1000, sort: { fields: [frontmatter___date], order: DESC }, filter: { frontmatter: { category: { eq: $category } } }) {
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
