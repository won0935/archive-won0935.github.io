import React from 'react';
import styled from 'styled-components';

export const IndexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 2em;
  min-height: 85vh;
  @media screen and (max-width: ${props => props.theme.responsive.large}) {
    display: block;
  }
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    margin-top: 0;
  }
`;

export const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - ${props => props.theme.sizes.bioWidth} - 40px);
  margin-right: 40px;
  @media screen and (max-width: ${props => props.theme.responsive.large}) {
    width: 100%;
  }
`;

interface Props {
  category: any;
  posts: any;
  bio: any;
  tableOfContents: any;
}

const MainWrapper = ({ ...props }: Props) => {
  const isCategory = props.category ? true : false;
  const isPosts = props.posts ? true : false;
  const isBio = props.bio ? true : false;
  const isTOC = props.tableOfContents ? true : false;

  return (
    <IndexWrapper>
      <ContentsWrapper>
        {isCategory && props.category}
        {isPosts && props.posts}
      </ContentsWrapper>
      {isBio && props.bio}
      {isTOC && props.tableOfContents}
    </IndexWrapper>
  );
};

export default MainWrapper;

// const Content = styled.div`
//   margin-top: 2em;
//   display: flex;
//   min-height: 85vh;
//   align-items: flex-start;
//   @media screen and (max-width: ${props => props.theme.responsive.large}) {
//     display: block;
//   }
//   @media screen and (max-width: ${props => props.theme.responsive.small}) {
//     margin-top: 0;
//   }
// `;

// const MainWrapper = styled.div`
//   width: calc(100% - ${props => props.theme.sizes.bioWidth} - 40px);
//   margin-right: 40px;
//   @media screen and (max-width: ${props => props.theme.responsive.large}) {
//     width: 100%;
//   }
// `;
