/** Plain text from EditorJS output or HTML/string description. */
export function editorJsToPlainText(content) {
  if (!content) return ''
  if (typeof content === 'string') {
    return content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim()
  }
  if (content.blocks?.length) {
    return content.blocks
      .map((block) => block.data?.text || '')
      .join(' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/<[^>]*>?/gm, '')
      .trim()
  }
  return ''
}

/** Render-friendly paragraphs from EditorJS blocks. */
export function editorJsBlocks(content) {
  if (!content?.blocks?.length) return []
  return content.blocks
    .map((block) =>
      String(block.data?.text || '')
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>?/gm, '')
        .trim()
    )
    .filter(Boolean)
}

/** True if value looks like HTML from Quill/rich editors. */
export function isHtmlContent(value) {
  return typeof value === 'string' && /<[a-z][\s\S]*>/i.test(value)
}
