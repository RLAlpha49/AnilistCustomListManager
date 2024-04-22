// eslint-disable-next-line no-redeclare
/* global IntersectionObserver */
window.onload = function () {
  const checkImagesInterval = setInterval(function () {
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
}
