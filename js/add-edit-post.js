import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

function removeUnusedFields(formValues) {
  const payload = { ...formValues }
  // imageSource = 'picsum' --> remove image
  // imageSource = 'upload' --> remove imageUrl
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl
  } else {
    delete payload.image
  }

  // finally remove imageSource
  delete payload.imageSource

  // remove id if it's add mode
  if (!payload.id) delete payload.id
  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }

  return formData
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedFields(formValues)
    // console.log('submit from parent', { formValues, payload })

    const formData = jsonToFormData(payload)
    // throw new Error('something from testing')
    //check add/edit mode
    //S1: based on search params (check id)
    //S2: check id in formValue

    // let savedPost = null
    // if (formValues.id) {
    //   savedPost = await postApi.update(formValues)
    // } else {
    //   savedPost = await postApi.add(formValues)
    // }

    // call Api
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

    // show success message
    toast.success('Saved post successfully!')

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${formValues.id}`)
    }, 2000)

    // console.log('redirect to', formValues.id)
  } catch (error) {
    toast.error(`Error: ${error.message}`)
  }
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValue = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }
    // if (postId) {
    //   defaultValue = await postApi.getById(postId)
    // }

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
