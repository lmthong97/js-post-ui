import postApi from './api/postApi'
import { initPostForm } from './utils/post-form'
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
      onSubmit: (formValue) => {
        console.log('submit', error)
      },
    })
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
