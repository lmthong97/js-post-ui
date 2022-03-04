import postApi from './api/postApi'
import { initPostForm } from './utils/post-form'

async function handlePostFormSubmit(formValues) {
  //   console.log('submit from parent', formValues)

  try {
    //check add/edit mode
    //S1: based on search params (check id)
    //S2: check id in formValue

    // let savedPost = null
    // if (formValues.id) {
    //   savedPost = await postApi.update(formValues)
    // } else {
    //   savedPost = await postApi.add(formValues)
    // }

    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    // call Api
    // show success message
    // redirect to detail page
    window.location.assign(`/post-detail.html?id=${formValues.id}`)
    // console.log('redirect to', formValues.id)
  } catch (error) {
    console.log('failed to save post', error)
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
