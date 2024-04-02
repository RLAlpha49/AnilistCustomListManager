// Filename: public/scripts/sidebarExpanded.js

// Add a click event listener to the element with id 'arrow'
export default function addSidebarToggleEventListener () {
  const arrow = document.getElementById('arrow')
  if (arrow) {
    arrow.addEventListener('click', function () {
      const sidebar = document.getElementsByClassName('sidebar')[0]

      if (sidebar.classList.contains('expanded')) {
        sidebar.classList.remove('expanded')
        arrow.classList.remove('expanded')
      } else {
        sidebar.classList.add('expanded')
        arrow.classList.add('expanded')
      }
    })
  } else {
    console.log('Element with id "arrow" was not found in the DOM.')
  }
}