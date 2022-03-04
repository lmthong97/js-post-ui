import postApi from './api/postApi'
import {
  initSearch,
  initPagination,
  renderPagination,
  renderPostList,
  toast,
} from './utils'

async function handleFilterChange(filterName, filterValue) {
  try {
    //update query params
    const url = new URL(window.location)
    if (filterName) url.searchParams.set(filterName, filterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams)
    //re-render post list
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail

      const message = `Are you sure to remove post "${post.title}"`
      if (window.confirm(message)) {
        await postApi.remove(post.id)

        await handleFilterChange()
        toast.success('Remove post successfully')
      }
    } catch (error) {
      console.log('Failed to remove post', error)
      toast.error(error.message)
    }
    // call Api to remove post by id
    // refetch data
  })
}

// MAIN
;(async () => {
  try {
    // set default pagination (_page, _limit) on URL
    const url = new URL(window.location)

    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    registerPostDeleteEvent()

    // attach click event for link
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    //render post list base URL params
    // const queryParams = new URLSearchParams(window.location.search)
    //set default query params if not exists
    // const { data, pagination } = await postApi.getAll(queryParams)
    // renderPostList('postList', data)
    // renderPagination('pagination', pagination)
    handleFilterChange()
  } catch (error) {
    console.log('getAll error', error)
  }
})()
