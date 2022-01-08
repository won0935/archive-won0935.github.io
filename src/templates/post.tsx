import { graphql } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import twemoji from 'twemoji';
import svgPattern from '../../static/images/svg/others/pattern.svg';
import CategoryLabel from '../components/CategoryLabel';
import PostJsonLd from '../components/json/PostJsonLd';
import Layout from '../components/Layout';
import MainWrapper from '../components/MainWrapper';
import RelatedPosts from '../components/RelatedPosts';
import SEO from '../components/SEO';
import TableOfContents from '../components/TableOfContents';
import Utterances from '../components/Utterances';
import { PostPageContext, QueryResult } from '../models';
import postContentStyle from '../styles/postContent';
import postCustomBlockStyle from '../styles/postCustomBlock';
import postSyntaxHighlightStyle from '../styles/postSyntaxHighlight';

const Content = styled.section`
  position: relative;
  background: #fff;
  overflow: hidden;
  font-size: 16px;
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    z-index: 5;
    transition: all 0.2s ease-out 0s;
  }
  &:before {
    top: 0;
    left: 0;
    border-top: 20px solid var(--bg);
    border-right: 20px solid transparent;
  }
  &:after {
    bottom: 0;
    right: 0;
    border-bottom: 20px solid var(--bg);
    border-left: 20px solid transparent;
  }
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    margin: 0 -${props => props.theme.sideSpace.small};
    &:before,
    &:after {
      content: none;
    }
  }
`;

const HeroImage = styled.p`
  position: relative;
  background: ${props => props.theme.colors.blackLight};
  text-align: center;
  background-image: url("${svgPattern}");
  background-repeat: repeat;
  background-size: 400px;
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  .emoji {
    width: 110px;
    height: 110px;
  }
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    min-height: 190px;
  }
`;

const ContentMain = styled.div`
  padding: 1.8em ${props => props.theme.sideSpace.contentLarge};
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    padding: 30px ${props => props.theme.sideSpace.contentSmall};
  }
`;

const PostTitle = styled.h1`
  margin: 0.1em 0 0.3em;
  font-size: 1.8em;
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    font-size: 25px;
  }
  font-weight: 700;
  line-height: 1.5;
`;

const PostDate = styled.time`
  display: block;
  color: ${props => props.theme.colors.silver};
  font-size: 0.9em;
  letter-spacing: 0.05em;
`;

const PostContent = styled.div`
  ${postSyntaxHighlightStyle}
  ${postContentStyle}
  ${postCustomBlockStyle}
`;

interface Props {
  data: QueryResult;
  pageContext: PostPageContext;
  location: any;
}

const BlogPostTemplate = ({ ...props }: Props) => {
  const post = props.data.markdownRemark;
  const tocItems = post.tableOfContents;

  const { siteUrl, title: siteTitle } = props.data.site.siteMetadata;
  const { relatedPosts, slug } = props.pageContext;
  const { title, description, date, category, emoji } = post.frontmatter;

  const location = props.location;
  const location_full_url = `${siteUrl + location.pathname}`;

  const [currentHeaderUrl, setCurrentHeaderUrl] = useState(undefined);
  const HEADER_OFFSET = 30;

  useEffect(() => {
    const handleScroll = () => {
      let aboveHeaderUrl;
      const currentOffsetY = window.pageYOffset;
      const headerElements: any = document.querySelectorAll('.anchor-header');
      for (const elem of headerElements) {
        const { top } = elem.getBoundingClientRect();
        const elemTop = top + currentOffsetY;
        const isLast = elem === headerElements[headerElements.length - 1];
        if (currentOffsetY < elemTop - HEADER_OFFSET) {
          // 기억해둔 aboveHeaderUrl이 있다면 바로 위 header와 현재 element 사이에 화면이 스크롤 되어 있다.
          aboveHeaderUrl && setCurrentHeaderUrl(aboveHeaderUrl.split(location.origin)[1]);
          // 기억해둔 aboveHeaderUrl이 없다면 첫번째 header다.
          // 이때는 어떤 header도 active 하지 않은 상태다.
          !aboveHeaderUrl && setCurrentHeaderUrl(undefined);
          break;
        } else {
          // 마지막 header면 다음 element가 없기 때문에 현재 header를 active header라 간주한다.
          isLast && setCurrentHeaderUrl(elem.href.split(location.origin)[1]);
          !isLast && (aboveHeaderUrl = elem.href);
        }
      }
      // if (aboveHeaderUrl !== undefined){
      //   const url = aboveHeaderUrl.split(location.origin)[1];
      //   let element = document.querySelector(`a[href='${url}']`);
      //   if(element){
             
      //   }
      // }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!post) {
    return null;
  }

  const isTOCVisible = tocItems?.length > 0;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={title} description={description || post.excerpt} />
      <Helmet>
        <link rel="canonical" href={location_full_url} />
      </Helmet>
      <PostJsonLd title={title} description={description || post.excerpt} date={date} url={location.href} categorySlug={category} />
      <MainWrapper
        posts={
          <Content>
            <HeroImage
              dangerouslySetInnerHTML={{
                __html: twemoji.parse(emoji || '😺', {
                  folder: 'svg',
                  ext: '.svg',
                }),
              }}
            />
            <ContentMain>
              <PostDate>{date}</PostDate>
              <PostTitle>{title}</PostTitle>
              <CategoryLabel slug={category} isLink={true} />
              <PostContent dangerouslySetInnerHTML={{ __html: post.html }} />
            </ContentMain>
            <aside>
              <RelatedPosts posts={relatedPosts} />
              <Utterances repo="wwlee94/wwlee94.github.io" theme="github-light" />
            </aside>
          </Content>
        }
        tableOfContents={isTOCVisible && <TOC tocItems={tocItems} currentHeaderUrl={currentHeaderUrl} />}
        category={null}
        bio={null}
      />
    </Layout>
  );
};

export default BlogPostTemplate;

const TOC = ({ ...props }: any) => {
  return <TableOfContents items={props.tocItems} currentHeaderUrl={props.currentHeaderUrl} />;
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      frontmatter {
        title
        description
        date(formatString: "YYYY.MM.DD")
        emoji
        category
      }
    }
  }
`;
