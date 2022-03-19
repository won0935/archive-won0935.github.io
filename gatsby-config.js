module.exports = {
  siteMetadata: {
    title: `Jay 기술 블로그`,
    author: `won0935`,
    description: `📚'기억보다 기록을' 목표로 
    공부한 내용을 정리하는 블로그 ✔︎`,
    siteUrl: `https://won0935.github.io`,
    email: `won0935@gmail.com`,
    social: {
      github: `https://github.com/won0935`,
      notion: `https://dev-song.notion.site/Clean-Neat-Code-955801f71953414097b2992b1ed9f3b2`,
    },
    adsense: {
      adClient: process.env.GOOGLE_AD_CLIENT || 'none',
      adSlot: process.env.GOOGLE_AD_SLOT || 'none',
    },
    // Blue : #2EA2DB
    categories: [
      // {
      //   name: `블로그`,
      //   slug: `blog`,
      //   color: `#ffa22b`,
      //   icon: `blogIcon`,
      //   link: `/category/blog`,
      // },
      // {
      //   name: `알고리즘`,
      //   slug: `algorithm`,
      //   color: `#f7615f`,
      //   icon: `algorithmIcon`,
      //   link: `/category/algorithm`,
      // },
      // {
      //   name: `스터디`,
      //   slug: `study`,
      //   color: `#C0D545`,
      //   icon: `studyIcon`,
      //   link: `/category/study`,
      // },
      {
        name: `스프링`,
        slug: `spring`,
        color: `#d55b45`,
        icon: `springIcon`,
        link: `/category/spring`,
      },
      {
        name: `디자인 패턴`,
        slug: `design-pattern`,
        color: `#45d5b3`,
        icon: `designIcon`,
        link: `/category/design-pattern`,
      },
      {
        name: `시스템설계`,
        slug: `system`,
        color: `#8b45d5`,
        icon: `systemIcon`,
        link: `/category/system`,
      },
      // {
      //   name: `메시지 큐`,
      //   slug: `message-queue`,
      //   color: `#d545d3`,
      //   icon: `messageIcon`,
      //   link: `/category/message-queue`,
      // },
      {
        name: `모니터링`,
        slug: `monitoring`,
        color: `#cbd545`,
        icon: `monitoringIcon`,
        link: `/category/monitoring`,
      },
      {
        name: `코틀린`,
        slug: `kotlin`,
        color: `#cc6287`,
        icon: `kotlinIcon`,
        link: `/category/kotlin`,
      },
      {
        name: `기타`,
        slug: `extra`,
        color: `#4597d5`,
        icon: `cactusYellow`,
        link: `/category/extra`,
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jay | 기술 블로그`,
        short_name: `Jay`,
        start_url: `/`,
        background_color: `rgb(33, 36, 45)`,
        theme_color: `#0c9ee4`,
        display: `minimal-ui`,
        icon: `static/images/favicon.png`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/contents`,
        name: `contents`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-code-titles`,
          {
            resolve: 'gatsby-remark-embed-youtube',
            options: {
              width: 650,
              height: 365,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 750,
              linkImagesToOriginal: true,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: 'gatsby-remark-custom-blocks',
            options: {
              blocks: {
                simple: {
                  classes: 'simple',
                  title: 'optional',
                },
                info: {
                  classes: 'info',
                  title: 'optional',
                },
                alert: {
                  classes: 'alert',
                  title: 'optional',
                },
                notice: {
                  classes: 'notice',
                  title: 'optional',
                },
                imageSmall: {
                  classes: 'image-small',
                },
                imageMedium: {
                  classes: 'image-medium',
                },
              },
            },
          },
          {
            // Table of contents
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `anchor-header`, // 이 class명으로 하이라이트 코드를 구현할 예정이므로 반드시 넣자.
              maintainCase: false, // 이 부분은 반드시 false로 하자. url이 대소문자를 구분하기 때문에 링크가 작동하지 않을 수 있다.
              removeAccents: true,
              elements: [`h1`, `h2`, 'h3', `h4`, `h5`], // 링크를 추가할 Header 종류 선택
            },
          },
          {
            // 코드 하이라이트
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: true,
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://won0935.github.io`,
        sitemap: `https://won0935.github.io/sitemap.xml`,
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: "Your Site's RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: '^/category/',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID || 'none',
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-dark-mode`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-sitemap`,
  ],
};
