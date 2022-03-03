function showModal(modalElement) {
  // make sure bootstrap script is loaded
  if (!window.bootstrap) return

  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  //handel click for all imgs
  //img click --> find all imgs with same album/gallery
  //determine index of selected img
  //show modal with selected img
  //handel prev/next click

  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // check if modal is registered or not
  if (Boolean(modalElement.dataset.registered)) return

  // selectors
  const imageElement = document.querySelector(imgSelector)
  const prevButton = document.querySelector(prevSelector)
  const nextButton = document.querySelector(nextSelector)
  if (!imageElement || !prevButton || !nextButton) return

  // lightbox vars
  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src
  }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    //ìmg with data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)
    // console.log('album image click', { target, currentIndex, imgList })

    showImageAtIndex(currentIndex)

    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    //show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })

  nextButton.addEventListener('click', () => {
    //show next image of current album
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  // mark this modal is already registered
  modalElement.dataset.registered = 'true'
}
