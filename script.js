const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const productTrack = document.querySelector('.horizontal-track');

productTrack.addEventListener('wheel', (event) => {
  const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (movement && productTrack.scrollWidth > productTrack.clientWidth) {
    event.preventDefault();
    productTrack.scrollLeft += movement;
  }
}, { passive: false });

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
  });
});
