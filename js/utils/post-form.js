import { setBackgroundImage, setFieldValue, setTextContent } from './common'

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

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]')
  if (!titleElement) return
  //required
  if (titleElement.validity.valueMissing) return 'Please enter title.'

  //at least 2 words
  if (
    titleElement.value.split(' ').filter((x) => !!x && x.length > 2).length < 2
  ) {
    return 'Please enter at least two words of 3 characters'
  }
  return ''
}

function validatePostForm(form, formValues) {
  //get errors
  const errors = {
    title: getTitleError(form),
    //author: getAuthorError(form),
    //...
  }

  //set errors
  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`)

    if (element) {
      element.setCustomValidity(errors[key])
      setTextContent(element.parentElement, '.invalid-feedback', errors[key])
    }
  }

  //add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
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
    if (!validatePostForm(form, formValues)) return
  })
}
