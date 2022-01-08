import { css } from 'styled-components';

const boxPaddingSide = '1.2em';

const SyntaxHighlightStyle = css`
  .gatsby-highlight {
    margin: 1.5em 0;
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      margin: 1.5em -${props => props.theme.sideSpace.contentSmall};
    }
  }
  code[class*='language-'],
  pre[class*='language-'] {
    hyphens: none;
    font-family: Menlo, Monaco, 'Courier New', monospace;
    color: #ccc;
    text-shadow: none;
    word-break: break-all;
  }
  pre[class*='language-'],
  :not(pre) > code[class*='language-'] {
    background: ${props => props.theme.colors.blackLight};
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      border-radius: 0;
    }
  }

  pre[class*='language-'] {
    padding: 1.2em ${boxPaddingSide};
    -webkit-overflow-scrolling: touch;
    position: relative;
    font-size: 14.5px;
    line-height: 1.7;
    overflow: auto;
  }

  /* gatsby-remark-prismjs : Add line number */
  .gatsby-highlight pre[class*='language-'].line-numbers {
    padding-left: 3.4em;
  }
  pre[class*='language-'].line-numbers span.line-numbers-rows {
    padding: 1.2em 0 1.2em 0.7em;
    background-color: hsla(0, 0%, 78.4%, 0.15);
    border: none;
  }

  .token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #999;
  }

  .token.punctuation {
    color: #ccc;
  }

  .token.tag,
  .token.attr-name,
  .token.namespace,
  .token.deleted {
    color: #e2777a;
  }

  .token.function-name {
    color: #6196cc;
  }

  .token.boolean,
  .token.number,
  .token.function {
    color: #f08d49;
  }

  .token.property,
  .token.class-name,
  .token.constant,
  .token.symbol {
    color: #f8c555;
  }

  .token.selector,
  .token.important,
  .token.atrule,
  .token.keyword,
  .token.builtin {
    color: #cc99cd;
  }

  .token.string,
  .token.char,
  .token.attr-value,
  .token.regex,
  .token.variable {
    color: #7ec699;
  }

  .token.operator,
  .token.entity,
  .token.url {
    color: #67cdcc;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.inserted {
    color: green;
  }

  /* 
    [Delete] Line highlight plugin 
    Ex) javascript{1,4-6}
  */

  /* gatsby-remark-code-titles */
  .gatsby-code-title {
    position: relative;
    margin: 1.5em 0 -24px auto;
    background: #616161;
    color: #fff;
    font-size: 12px;
    height: 24px;
    padding: 0 8px;
    line-height: 24px;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
    font-weight: 500;
    border-radius: 0 5px;
    display: table;
    z-index: 2;
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      border-radius: 0 0 0 5px;
      margin-right: -${props => props.theme.sideSpace.contentSmall};
    }
  }
  .gatsby-code-title + .gatsby-highlight {
    margin-top: 0;
  }

  /* Inline code */
  p > code,
  li > code {
    color: #ff3860 !important;
    background: #f9f1f3;
    padding: 0.15em 0.4em;
    margin: 0.2em;
    border-radius: 4px;
    font-size: 0.85em;
    word-break: break-all;
    white-space: pre-line;
  }

  strong > code {
    font-family: inherit !important;
  }
`;

export default SyntaxHighlightStyle;
