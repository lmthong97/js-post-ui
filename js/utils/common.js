export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export function truncateTextlength(text, length) {
  if (length < 0 || !text) return ''

  const truncatedText = text.length > length ? `${text.substring(0, length - 3)}...` : text

  return truncatedText
}
