import dayjs from 'dayjs'
import postApi from './api/postApi'
import { setTextContent } from './utils'

// goToEditPageLink
// postHeroImage
// postDetailTitle
// postDetailAuthor
// postDetailTimeSpan
// postDetailDescription

// id: "sktwi1cgkkuif36dl", title: "Dolore laudantium et", author: "Virgie Cruickshank",…}
// author: "Virgie Cruickshank"
// createdAt: 1633700485639
// description: "voluptatem consequuntur officiis repellat voluptatum nihil ipsa quis officia eaque dolor ipsam repellendus amet iusto non enim est adipisci autem harum commodi incidunt exercitationem quasi commodi quia maiores porro animi quis ab mollitia consequatur dolores consequatur sit incidunt quibusdam aliquam commodi molestiae voluptatem et odio aut fugit nemo magnam perferendis"
// id: "sktwi1cgkkuif36dl"
// imageUrl: "https://picsum.photos/id/914/1368/400"
// title: "Dolore laudantium et"
// updatedAt: 1633700485639
function renderPostDetail(post) {
  if (!post) return
  //render title
  //render description
  //render author
  //render updateAt

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.createdAt).format(' - DD/MM/YYYY HH:mm')
  )

  //render hero image (imageUrl)
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`

    heroImage.addEventListener('error', () => {
      console.log('load image error --> use default placeholder')
      heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }

  //render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
    editPageLink.innerHTML = `<i class="fas fa-edit"></i> Edit Post`
  }
}

;(async () => {
  try {
    //get post id from url
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) {
      console.log('post id not found')
      return
    }
    //fetch post detail API
    const post = await postApi.getById(postId)
    //render post detail
    renderPostDetail(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
