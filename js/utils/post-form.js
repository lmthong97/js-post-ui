import {
  setBackgroundImage,
  setFieldValue,
  setTextContent,
  randomNumber,
} from './common'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}
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

// function getTitleError(form) {
//   const titleElement = form.querySelector('[name="title"]')
//   if (!titleElement) return
//   //required
//   if (titleElement.validity.valueMissing) return 'Please enter title.'

//   //at least 2 words
//   if (
//     titleElement.value.split(' ').filter((x) => !!x && x.length > 2).length < 2
//   ) {
//     return 'Please enter at least two words of 3 characters'
//   }
//   return ''
// }

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) =>
          value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please radom a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please an image to upload', (file) =>
          Boolean(file?.name)
        )
        .test('max-3mb', 'The image is too large (max 3MB)', (file) => {
          const fileSize = file?.size || 0
          const MAX_SIZE = 3 * 1024 * 1024 // 3 MB
          // const MAX_SIZE = 10 * 1024 // 10 KB

          return fileSize <= MAX_SIZE
        }),
    }),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)

  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  //   //get errors
  //   const errors = {
  //     title: getTitleError(form),
  //     //author: getAuthorError(form),
  //     //...
  //   }

  //   //set errors
  //   for (const key in errors) {
  //     const element = form.querySelector(`[name="${key}"]`)

  //     if (element) {
  //       element.setCustomValidity(errors[key])
  //       setTextContent(element.parentElement, '.invalid-feedback', errors[key])
  //     }
  //   }
  try {
    //reset prev error
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) =>
      setFieldError(form, name, '')
    )

    // start validating
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        //ignore if the field is already logged
        if (errorLog[name]) continue

        //set field error and mark as logged
        setFieldError(form, name, validationError.message)

        errorLog[name] = true
      }
    }
  }

  //add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

function innitRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    // random ID
    // build URL
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`
    // set imageUrl input and background
    setFieldValue(form, '[name="imageUrl"]', imageUrl) // hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) =>
      renderImageSourceControl(form, event.target.value)
    )
  })
}
function initUploadImage(form) {
  const uploadInput = form.querySelector('[name="image"]')
  if (!uploadInput) return

  uploadInput.addEventListener('change', (event) => {
    // get selected file
    const fileImage = event.target.files[0]
    // preview file
    if (fileImage) {
      const imageUrl = URL.createObjectURL(fileImage)
      setBackgroundImage(document, '#postHeroImage', imageUrl)
    }
  })
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false

  setFormValue(form, defaultValue)

  // init event
  innitRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    //prevent other submission
    if (submitting) return

    //show loading/ disabled button
    showLoading(form)
    submitting = true

    //get form values
    const formValues = getFormValues(form)
    formValues.id = defaultValue.id

    //validation
    //if valid trigger submit callback
    //otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    // always hide loading no matter form is valid or not
    hideLoading(form)
    submitting = false
  })
}
