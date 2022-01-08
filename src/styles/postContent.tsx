import { css } from 'styled-components';
import svgHeadingIcon from '../../static/images/svg/others/heading-icon.svg';

const postContentStyle = css`
  margin: 1.5em 0 1em;
  line-height: 1.9;

  a:hover {
    text-decoration: underline;
  }
  p {
    margin: 0.5em 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 40px 0 10px;
    font-weight: 700;
    line-height: 1.5;
  }
  h1{
    margin: 45px 0 12px;
    padding: 5px 0 5px 17px;
    font-size: 1.55em;
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      display: inline-block;
      width: 5px;
      height: 100%;
      border-radius: 5px;
      background: linear-gradient(0deg,#ffa649 0% ,#ffa649 50%,#f7645b 50%,#f7645b 100%);
    }
  }
  h2 {
    position: relative;
    margin: 45px 0 12px;
    padding: 5px 0 5px 17px;
    font-size: 1.40em;
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      display: inline-block;
      width: 5px;
      height: 100%;
      border-radius: 5px;
      background: linear-gradient(0deg,#ffa649 0% ,#ffa649 50%,#f7645b 50%,#f7645b 100%);
    }
  }
  h3 {
    margin: 40px 0 12px;
    font-size: 1.40em;
  }
  h4 {
    position: relative;
    padding-left: 18px;
    font-size: 1.2em;
    &:before {
      position: absolute;
      top: .2em;
      left: 0;
      content: "";
      display: inline-block;
      width: 14px;
      height: 19px;
      background-image: url("${svgHeadingIcon}");
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  ul, ol {
    margin: 1em 0;
    p {
      margin: 0;
    }
  }
  ul {
    padding-left: 1.2em;
    li {
      margin: .4em 0;
      list-style: disc;
    }
    ul, ol {
      margin: 0;
    }
  }
  ol {
    counter-reset: number;
    & > li {
      list-style: none;
      list-style-position: inside;
      position: relative;
      padding: 0 0 0 30px;
      margin: 0.5em 0;
      &:before {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;
        margin: .4em 0;
        border-radius: 25%;
        background: #5c9ee7;
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        content: counter(number);
        counter-increment: number;
      }
    }
    ul {
      margin: 0;
    }
  }
  strong {
    font-weight: 550;
    font-size: 1.1em;
  }
  em {
    font-style: italic;
  }
  del {
    text-decoration: line-through;
  }
  hr {
    display: block;
    margin: 2em 0;
    border: none;
    border-top: dotted 3px #e1eaf3;
  }
  table {
    display: block;
    margin: 1em 0;
    border-spacing: 2px;
    border-collapse: separate;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    width: auto;
    font-size: .9em;
    line-height: 1.4;
    th {
      background-color: ${props => props.theme.colors.blackLight};
      color: #FFF;
      padding: 10px 12px;
      text-align: center;
      font-weight: 700;
      &[align="center"] {
        text-align: center;
      }
      &[align="right"] {
        text-align: right;
      }
    }
    td {
      background-color:  ${props => props.theme.colors.whitesmoke};
      color: ${props => props.theme.colors.blackLight};
      padding: 10px 12px;
    }
    td code[class*='language-'] {
      color: ${props => props.theme.colors.blackLight};
    }
    thead tr {
      th:first-child {
        border-radius: 5px 0 0 0;
      }
      th:last-child {
        border-radius: 0 5px 0 0;
      }
    }
    tbody tr:last-child {
      td:first-child {
        border-radius: 0 0 0 5px;
      }
      td:last-child {
        border-radius: 0 0 5px 0;
      }
    }
  }
  blockquote {
    margin: 1em 0;
    padding: 0 1em;
    color: #6a737d;
    border-left: .25em solid #dfe2e5;
  }
  .gatsby-resp-image-wrapper {
    margin: 2em 0;
    box-shadow: 1px 1px 20px lightgrey;
    // box-shadow: rgba(0, 0, 0, 0.2) 0px 15px 30px -5px, rgba(0, 0, 0, 0.22) 0px 9px 18px -9px;
    border-radius: 4px;
    overflow: hidden;
  }
  .anchor-header {
    margin: 2px 0 0 0;
  }
`;

export default postContentStyle;
