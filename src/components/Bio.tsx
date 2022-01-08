import notionIcon from '@iconify/icons-simple-icons/notion';
import { Icon } from '@iconify/react';
import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { MdMail } from 'react-icons/md';
import styled from 'styled-components';
import avatar from '../../static/images/avatar.png';
import { QueryResult } from '../models';

const BioWrapper = styled.div`
  position: sticky;
  top: 2em;
  width: ${props => props.theme.sizes.bioWidth};
  padding: 1.5em;
  font-size: 15.5px;
  background: var(--bioBackground);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  @media screen and (max-width: ${props => props.theme.responsive.large}) {
    position: relative;
    margin: 2em 0;
    width: 100%;
  }
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    padding: 1.3em 1em;
  }
`;

const AvatarImage = styled.img`
  display: block;
  width: 70px;
  height: 70px;
  border-radius: 50%;
`;

const BioHeader = styled.div`
  display: flex;
  align-items: center;
`;
const BioName = styled.div`
  margin-left: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 1.3em;
  color: var(--bioColor);
`;
const BioMain = styled.div`
  margin-top: 1em;
`;
const BioText = styled.div`
  color: var(--bioColor);
  font-size: 0.92em;
`;
const BioLinks = styled.div`
  margin-top: 1.5em;
  display: flex;
  color: var(--bioColor);
  text-align: center;
  max-width: 244px;
  img {
    display: block;
    margin: 0 auto;
    width: 40px;
    height: 33px;
  }
`;

const BioLink = styled.a`
  width: 33.3%;
  display: block;
  font-weight: 700;
  font-size: 0.9em;
  line-height: 30px;
  color: ${props => props.theme.colors.gray};
  letter-spacing: 0.5px;
  &:hover {
    color: var(--bioHighlight);
  }
`;

const Bio = () => {
  return (
    <StaticQuery
      query={bioQuery}
      render={(data: QueryResult) => {
        const { author, email, social, description } = data.site.siteMetadata;
        return (
          <BioWrapper>
            <BioHeader>
              <AvatarImage src={avatar} alt={author} />
              <BioName>{author}</BioName>
            </BioHeader>
            <BioMain>
              <BioText>
                {description.split('\n').map((item: string, i: number) => {
                  return <p key={i}>{item}</p>;
                })}
              </BioText>
              <BioLinks>
                <BioLink href={`${social.notion}`}>
                  <Icon icon={notionIcon} width="32" height="32" />
                </BioLink>
                <BioLink href={`${social.github}`}>
                  <FaGithub size={32} />
                </BioLink>
                <BioLink className="bio-link--email" href={`mailto:${email}`}>
                  <MdMail size={32} />
                </BioLink>
              </BioLinks>
            </BioMain>
          </BioWrapper>
        );
      }}
    />
  );
};

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/avatar.png/" }) {
      childImageSharp {
        fixed(width: 70, height: 70) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        email
        social {
          github
          notion
        }
        description
      }
    }
  }
`;

export default Bio;
