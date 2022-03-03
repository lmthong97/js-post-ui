import { setBackgroundImage, setFieldValue } from './common'

function setFormValue(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)

  setFieldValue(form, '[name="imageUrl"]', formValue?.imageUrl) // hidden field
  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValue(form, defaultValue)
}
