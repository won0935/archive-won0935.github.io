import { createGlobalStyle } from 'styled-components';

const globalStyle = createGlobalStyle`
  /* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
  */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  html, body {
    height: 100%;
  }
  body {
    --bg: #f5f5f5;
    --textNormal: #21242d;
    --headerBackground: ${props => props.theme.colors.clearWhite};
    --bioBackground: #f5f5f5;
    --bioColor: ${props => props.theme.colors.black};
    --bioHighlight: ${props => props.theme.colors.clearBlack};
    --categoryHeader: ${props => props.theme.colors.black};
    --categoryColor: ${props => props.theme.colors.black};
    --categotyImgage: ${props => props.theme.colors.gradient};
    --postCardColor: ${props => props.theme.colors.black};
    --postCardHighlight: ${props => props.theme.colors.transparentBlack};
    --postCardEmoji: ${props => props.theme.colors.clearWhite};
    --postCardDivideLine: ${props => props.theme.colors.silver};
    --tableOfContentsFocusColor: rgb(33, 37, 41)

    background-color: var(--bg);
    color: var(--textNormal);

    line-height: 1.6;
    font-size: 100%;
    font-weight: 400;
    font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro","メイリオ", Meiryo, sans-serif;
    -webkit-text-size-adjust: 100%;
  }
  
  body.dark {
    --bg: #21242d;
    --textNormal: #21242d;
    --headerBackground: ${props => props.theme.colors.blue};
    --bioBackground: ${props => props.theme.colors.blackLight};
    --bioColor: ${props => props.theme.colors.clearWhite};
    --bioHighlight: ${props => props.theme.colors.clearWhite};
    --categoryHeader: ${props => props.theme.colors.clearWhite};
    --categoryColor: ${props => props.theme.colors.gray};
    --categotyImgage: ${props => props.theme.colors.blackLight};
    --postCardColor: ${props => props.theme.colors.clearWhite};
    --postCardHighlight: ${props => props.theme.colors.blackLight};
    --postCardEmoji: ${props => props.theme.colors.blackLight};
    --postCardDivideLine: ${props => props.theme.colors.blackLight};
    --tableOfContentsFocusColor:  ${props => props.theme.colors.whitesmoke};
    
    background-color: var(--bg);
    color: var(--textNormal);


    line-height: 1.6;
    font-size: 100%;
    font-weight: 400;
    font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro","メイリオ", Meiryo, sans-serif;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
  }
  
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  a {
    color: ${(props: any) => props.theme.colors.highlight};
    text-decoration: none;
    word-break: break-all;
    transition: .2s;
    :focus{
      outline: none;
    }
  }
  ol, ul, li {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote::before, blockquote::after,
  q::before, q::after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  img {
  	max-width: 100%;
  }
  button,
  input {
    font-family: inherit;
    font-size: inherit;
    background: none;
    border: none;
    outline: none;
    appearance: none;
    border-radius: 0;
    resize: none;
    &:focus {
      outline: none;
    }
  }
`;
export default globalStyle;
