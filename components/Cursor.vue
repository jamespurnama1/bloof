<template>
  <ClientOnly>
    <img ref="cursor" src="/images/cursor.png" alt="Cursor"
      class="origin-center cursor transform-gpu pointer-events-none z-[20000] fixed w-16 h-16 -top-8 -left-8 opacity-0 transition-transform ease-out" />
  </ClientOnly>
</template>

<script setup lang="ts">
const target = reactive({ x: 0, y: 0 })
let hoverables: NodeListOf<HTMLAnchorElement> | null = null
const linkSelected = ref(false);
const cursor: Ref<HTMLDivElement | null> = ref(null);

function hoverLink() {
  hoverables = document.querySelectorAll('a, button, input, label, .select');
  if (!hoverables || !hoverables.length) return
  hoverables.forEach(item => {
    if (item.getAttribute('listener') === 'true') return
    item.addEventListener('mouseover', () => {
      linkSelected.value = true;
    });
    item.addEventListener('mouseleave', () => {
      linkSelected.value = false;
    });
  })
}

onMounted(() => {
  let raf: (number | null) = requestAnimationFrame(render);

  function render() {
    if (!cursor.value) return;
    if (linkSelected.value) {
      cursor.value.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) scale(70%)`;
    } else {
      cursor.value.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) scale(33%)`;
    }

    raf = requestAnimationFrame(render);
  }

  document.addEventListener('mousemove', function (e) {
    target.x = e.clientX,
      target.y = e.clientY,
      cursor.value ? cursor.value.style.opacity = "1" : null;
    !raf ? raf = requestAnimationFrame(render) : null;
  });
  hoverLink()
})
</script>