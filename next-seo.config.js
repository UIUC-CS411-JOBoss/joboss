/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "joboss",
  titleTemplate: "%s | joboss",
  defaultTitle: "joboss",
  description: "Search Job Like a Boss",
  canonical: "https://joboss.netlify.app/",
  openGraph: {
    url: "https://joboss.netlify.app/",
    title: "joboss",
    description: "Search Job Like a Boss",
    // images: [
    //   {
    //     url: "https://og-image.sznm.dev/**joboss**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250",
    //     alt: "joboss.sznm.dev og-image",
    //   },
    // ],
    site_name: "joboss",
  },
  // twitter: {
  //   handle: "@sozonome",
  //   cardType: "summary_large_image",
  // },
};

export default defaultSEOConfig;
