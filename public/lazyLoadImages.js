/* eslint-disable no-redeclare */
/* global IntersectionObserver, MutationObserver */

let isRunning = false
let checkImagesInterval = null

window.onload = function () {
  if (isRunning) return
  isRunning = true
  const targetNode = document.querySelector('.center-container')

  const config = { childList: true }

  const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        clearInterval(checkImagesInterval)
        checkImagesInterval = setInterval(function () {
          const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'))

          if (lazyImages.length > 0) {
            clearInterval(checkImagesInterval)

            if ('IntersectionObserver' in window) {
              const lazyImageObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                  if (entry.isIntersecting) {
                    const lazyImage = entry.target
                    lazyImage.src = lazyImage.dataset.src
                    lazyImage.classList.remove('lazy')
                    lazyImageObserver.unobserve(lazyImage)
                  }
                })
              })

              lazyImages.forEach(function (lazyImage) {
                lazyImageObserver.observe(lazyImage)
              })
            }
          }
        }, 250)
        isRunning = false
      }
    }
  }

  const observer = new MutationObserver(callback)

  observer.observe(targetNode, config)
}
