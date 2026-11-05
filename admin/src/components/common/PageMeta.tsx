import { HelmetProvider, Helmet } from "react-helmet-async";
import { APP_DISPLAY_NAME, APP_SHORT_NAME } from "../../constants/brand";

const ADMIN_TITLE_SUFFIX = `${APP_SHORT_NAME} Admin`;

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  let cleanTitle = title || ADMIN_TITLE_SUFFIX;
  if (cleanTitle.includes("TailAdmin") || cleanTitle.includes("React.js")) {
    cleanTitle = cleanTitle
      .replace(/React\.js\s*/gi, "")
      .replace(/\s*Dashboard\s*\|\s*TailAdmin.*$/gi, ` | ${ADMIN_TITLE_SUFFIX}`)
      .replace(/\|\s*TailAdmin.*$/gi, `| ${ADMIN_TITLE_SUFFIX}`)
      .replace(/TailAdmin/gi, ADMIN_TITLE_SUFFIX)
      .trim();
    if (!cleanTitle.includes(ADMIN_TITLE_SUFFIX)) {
      cleanTitle = `${cleanTitle} | ${ADMIN_TITLE_SUFFIX}`;
    }
  }

  cleanTitle = cleanTitle
    .replace(/Xpertqa/gi, APP_SHORT_NAME)
    .replace(/XpertQA/gi, APP_SHORT_NAME);

  const cleanDescription = (description || "")
    .replace(/TailAdmin/gi, ADMIN_TITLE_SUFFIX)
    .replace(/React\.js\s*/gi, "")
    .replace(/Xpertqa/gi, APP_DISPLAY_NAME)
    .replace(/XpertQA/gi, APP_DISPLAY_NAME);

  return (
    <Helmet>
      <title>{cleanTitle}</title>
      <meta name="description" content={cleanDescription} />
    </Helmet>
  );
};

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
