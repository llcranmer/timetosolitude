module.exports = {
  siteMetadata: {
    siteTitle: 'Time to Solitude',
    siteDescription: 'A quiet place for thoughts',
    siteImage: '/banner.png', // main image of the site for metadata
    siteUrl: 'https://timetosolitude.com',
    pathPrefix: '/',
    siteLanguage: 'en',
    ogLanguage: `en_US`,
    author: 'nullPtr', // for example - 'Ivan Ganev'
    authorDescription: 'Budding climber, hacker, and writer', // short text about the author
    avatar: '/null-ptr.jpg',
    twitterSite: '', // website account on twitter
    twitterCreator: '', // creator account on twitter
    social: [
      {
        icon: `twitter`,
        url: `https://twitter.com/`
      },
      {
        icon: `github`,
        url: `https://github.com/`
      },
      {
        icon: `node-js`,
        url: `https://www.npmjs.com/package/gatsby-theme-chronoblog`
      }
    ]
  },
  plugins: [
    {
      resolve: 'gatsby-theme-chronoblog',
      options: {
        uiText: {
          // ui text fot translate
          feedShowMoreButton: 'show more',
          feedSearchPlaceholder: 'search',
          cardReadMoreButton: 'read more →',
          allTagsButton: 'all tags'
        },
        feedItems: {
          // global settings for feed items
          limit: 50,
          yearSeparator: true,
          yearSeparatorSkipFirst: true,
          contentTypes: {
            links: {
              beforeTitle: '🔗 '
            }
          }
        },
        feedSearch: {
          symbol: '🔍'
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Chronoblog Gatsby Theme`,
        short_name: `Chronoblog`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#3a5f7d`,
        display: `standalone`,
        icon: `src/assets/favicon.png`
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        trackingId: 'UA-169032305-1'
      }
    }
  ]
};
