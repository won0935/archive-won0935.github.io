import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import twemoji from 'twemoji';
import { MarkdownRemark } from '../models';
import CategoryLabel from './CategoryLabel';

const PostCardWrapper = styled.div`
  .post-card-link {
    display: flex;
    align-items: center;
    padding: 1.4em 0;
    transition: all 0.3s ease-in-out 0s; /* 테마 변환 시 애니메이션 */
    color: var(--postCardColor);
    border-bottom: solid 1px var(--postCardDivideLine);
    &:hover {
      background: var(--postCardHighlight);
    }
    @media screen and (max-width: ${props => props.theme.responsive.large}) {
      padding: 1em 0;
    }
  }
`;
const PostCardEmoji = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 10px;
  width: 90px;
  height: 90px;
  background: var(--postCardEmoji);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  font-size: 50px;
  img {
    width: 55px;
    height: 55px;
  }
  @media screen and (max-width: ${props => props.theme.responsive.large}) {
    margin: 0;
    width: 70px;
    height: 70px;
    img {
      width: 40px;
      height: 40px;
    }
  }
`;
const PostCardContent = styled.div`
  width: calc(100% - 90px);
  padding-left: 25px;
  padding-top: 0.2em;
  h3 {
    font-size: 1.3em;
    font-weight: 700;
    line-height: 1.4;
  }
  time {
    display: block;
    margin-top: 0.2em;
    margin-bottom: 0.2em;
    letter-spacing: 0.05em;
    font-size: 0.9em;
    color: ${props => props.theme.colors.gray};
  }
  @media screen and (max-width: ${props => props.theme.responsive.large}) {
    width: calc(100% - 70px);
    padding-left: 15px;
    h3 {
      font-size: 16.5px;
    }
    time {
      font-size: 12px;
      margin-bottom: 0;
    }
  }
`;

interface Props {
  node: MarkdownRemark;
}

const PostCard = ({ node }: Props) => {
  const title = node.frontmatter.title || node.fields.slug;
  const emoji = twemoji.parse(node.frontmatter.emoji || '🐱', {
    folder: 'svg',
    ext: '.svg',
  });

  return (
    <PostCardWrapper>
      <Link to={node.fields.slug} className="post-card-link">
        <PostCardEmoji dangerouslySetInnerHTML={{ __html: emoji }} />
        <PostCardContent>
          <h3>{title}</h3>
          <time>{node.frontmatter.date}</time>
          <CategoryLabel slug={node.frontmatter.category} />
        </PostCardContent>
      </Link>
    </PostCardWrapper>
  );
};

export default PostCard;
