import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  let cleanTitle = title || "Xpertqa Admin";
  if (cleanTitle.includes("TailAdmin") || cleanTitle.includes("React.js")) {
    cleanTitle = cleanTitle
      .replace(/React\.js\s*/gi, "")
      .replace(/\s*Dashboard\s*\|\s*TailAdmin.*$/gi, " | Xpertqa Admin")
      .replace(/\|\s*TailAdmin.*$/gi, "| Xpertqa Admin")
      .replace(/TailAdmin/gi, "Xpertqa Admin")
      .trim();
    if (!cleanTitle.includes("Xpertqa Admin")) {
      cleanTitle = `${cleanTitle} | Xpertqa Admin`;
    }
  }

  const cleanDescription = (description || "")
    .replace(/TailAdmin/gi, "Xpertqa Admin")
    .replace(/React\.js\s*/gi, "");

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
