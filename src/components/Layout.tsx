import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/global';
import DefaultTheme from '../styles/theme';
import ContentWrapper from './ContentWrapper';
import Footer from './Footer';
import Header from './Header';

const Content = styled.div`
  margin-top: 2em;
  min-height: 85vh;
  @media screen and (max-width: ${props => props.theme.responsive.large}) {
    display: block;
  }
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    margin-top: 0;
  }
`;

interface Props {
  location: any;
  title: string;
  children: any;
}

const Layout = ({ location, title, children }: Props) => {
  const body = (
    <ThemeProvider theme={DefaultTheme}>
      <>
        <GlobalStyle />
        <div
          className="App"
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--textNormal)',
            transition: 'color 0.2s ease-out, background 0.2s ease-out',
          }}
        >
          <Header title={title} location={location} />
          <ContentWrapper>
            <Content>
              <main>{children}</main>
            </Content>
          </ContentWrapper>
          <Footer />
        </div>
      </>
    </ThemeProvider>
  );

  return body;
};

export default Layout;
