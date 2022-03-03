import { setBackgroundImage, setFieldValue } from './common'

function setFormValue(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)

  setFieldValue(form, '[name="imageUrl"]', formValue?.imageUrl) // hidden field
  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

function getFormValues(form) {
  const formValues = {}

  // S1: query each input and add to formValues object
  //   ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`)
  //     if (field) formValues[name] = field.value
  //   })

  // S2: using form data
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValue(form, defaultValue)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    //get form values
    const formValues = getFormValues(form)
    console.log(formValues)

    //validation
    //if valid trigger submit callback
    //otherwise, show validation errors
  })
}
