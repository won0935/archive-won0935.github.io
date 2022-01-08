import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import pngLogo from '../../static/images/logo.png';
import ColorModeToggle from './ColorModeToggle';
import ContentWrapper from './ContentWrapper';

const HeaderTag = styled.header`
  background: var(--headerBackground);
  width: 100%;
  // border-bottom: solid 1px ${props => props.theme.colors.blackLight};
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;
`;

const HeaderInner = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  .logo {
    width: 200px;
    height: 55px;
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      margin: 0 auto;
    }
  }

  .message-link {
    position: absolute;
    right: 0;
    top: 7px;
    display: block;
    width: 34px;
    &:hover {
      top: 5px;
    }
  }
`;

interface Props {
  title: string;
  location: any;
}

const Header = ({ title, location }: Props) => {
  const logoLink = (
    <Link to={`/`} className="logo-link">
      <img className="logo" src={pngLogo} alt={title} />
    </Link>
  );
  // const rootPath = `${process.env.__PATH_PREFIX__}/`;
  // let headerLogo;
  // if (location.pathname === rootPath) headerLogo = <h1>{logoLink}</h1>;
  // else headerLogo = <h3>{logoLink}</h3>;

  return (
    <HeaderTag>
      <ContentWrapper>
        <HeaderInner>
          {logoLink}
          <ColorModeToggle />
        </HeaderInner>
      </ContentWrapper>
    </HeaderTag>
  );
};

export default Header;
