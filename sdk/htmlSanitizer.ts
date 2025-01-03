const removeAttributes = (html: string) => {
  return html.replace(/<[^>]*>/g, (tag) => {
    return tag.replace(/ [^=]+="[^"]*"/g, "");
  });
};
const keepAllowedTags = (html: string, tags: string[]) => {
  const closeTags = tags.map((tag) => `/${tag}`);
  return html.replace(/<[^>]*>/g, (tag) => {
    const tagName = tag.match(/<([^>\s]+)/)?.[1];
    if (!tagName) return "";
    return tags.includes(tagName) || closeTags.includes(tagName) ? tag : "";
  });
};
const removeWrapperTag = (html: string) => {
  return html ? html.replace(/<[^>]*>(.*)<\/[^>]*>/, "$1") : "";
};
const removeEmptyTags = (html: string) => {
  return html.replace(/<[^>]*>[\s]*<\/[^>]*>/g, "");
};

interface SanitizeOptions {
  removeWrapperTag?: boolean;
  removeAttributes?: boolean;
  allowedTags?: string[];
  removeEmptyTags?: boolean;
}

export const sanitizeHTMLCode = (html: string, opitions: SanitizeOptions) => {
  let result = html;

  if (opitions.removeWrapperTag) {
    result = removeWrapperTag(result);
  }
  if (opitions.removeAttributes) {
    result = removeAttributes(result);
  }
  if (opitions.allowedTags) {
    result = keepAllowedTags(result, opitions.allowedTags);
  }
  if (opitions.removeEmptyTags) {
    result = removeEmptyTags(result);
  }
  return result;
};
