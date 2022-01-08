import React from 'react';
import styled from 'styled-components';

const TableIndex = styled.div`
  position: sticky;
  top: 2em;
  display: flex;
  align-items: center;
  justify-content: left;
  width: ${props => props.theme.sizes.tableOfContentWidth};
  padding: 1.5em;
  background: none;
  border-radius: 4px;
  @media screen and (max-width: ${props => props.theme.responsive.large}) {
    position: relative;
    margin: 2em 0;
    width: 100%;
  }
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    padding: 1.3em 1em;
  }
`;

const TableWrapper = styled.div`
  display: block;
  width: 100%;
  max-height: calc(100vh - 150px);
  word-break: break-word;
  color: black;
  overflow: auto;
  border-left: 1.5px solid rgb(233, 236, 239);
`;

const TableHeader = styled.h1`
  display: block;
  text-align: left;
  font-size: 17px;
  color: var(--bioColor);
  padding-left: 15px;
  margin-bottom: 15px;
`;

const TableContents = styled.div`
  margin: 0 10px;
  font-size: 14px;
  overflow: hidden;
  transition: all 0.125s ease-in 0s;
  
  a {
    display: block;
    color: rgb(134, 142, 150);
  };

  a:hover {
    color: var(--tableOfContentsFocusColor);
  }

  ul {
    list-style: none;
    margin-left: 10px;
    margin-bottom: 0px;
    line-height: 1.5rem;
  };

  ul > li a[href='${(props: TableContentsProps) => props.currentHeaderUrl}'] {
    color: var(--tableOfContentsFocusColor);
    transform: scale(1.05);
  };
`;

interface TableContentsProps {
  currentHeaderUrl: string | undefined;
}

interface Props {
  items: any;
  currentHeaderUrl: string | undefined;
}

const TableOfContents = ({ items, currentHeaderUrl }: Props) => {
  return items ? (
    <TableIndex>
      <TableWrapper className="table-of-contents">
        <TableHeader>🔖 Catalog</TableHeader>
        <TableContents dangerouslySetInnerHTML={{ __html: items }} currentHeaderUrl={currentHeaderUrl} />
      </TableWrapper>
    </TableIndex>
  ) : null;
};

export default TableOfContents;
