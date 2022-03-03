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
export function setFieldValue(form, selector, text) {
  if (!form) return

  const field = form.querySelector(selector)
  if (field) field.value = text
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.style.backgroundImage = `url("${imageUrl}")`
}
