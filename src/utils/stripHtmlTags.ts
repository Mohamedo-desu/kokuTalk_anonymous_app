export const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
};
