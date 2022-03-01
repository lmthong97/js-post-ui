import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateTextlength } from './common'

//to use fromNow function
dayjs.extend(relativeTime)

export function createPostElement(post) {
  if (!post) return
  //find and clone the template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  //update title, author, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateTextlength(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)
  // const titleElement = liElement.querySelector('[data-id="title"]')
  // if (titleElement) titleElement.textContent = post.title

  // const descriptionElement = liElement.querySelector('[data-id="description"]')
  // if (descriptionElement) descriptionElement.textContent = post.description

  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if (authorElement) authorElement.textContent = post.author

  //calculator time update

  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }
  //attach event

  return liElement
}

export function renderPostList(elementId, postList) {
  console.log({ postList })
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  //clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
