<script setup>
import { onMounted, onUpdated, ref, watch, watchEffect } from 'vue';

const props = defineProps({
  position: {
    type: String, // "left-bototm" | "right-bottom">,
    default: "left-bottom",
  },
});

const dropdownWrapper = ref();
const openDropdown = ref(false);

function setRef(el) {
  dropdownWrapper.value = el;
}

watchEffect((cleanUP) => {
  function clieckHandler() {
    openDropdown.value = false;
  }

  document.addEventListener("click", clieckHandler);
  return cleanUP(() => {
    document.removeEventListener("click", clieckHandler);
  });
});

function toggle() {
  
  openDropdown.value = !openDropdown.value;
}

onUpdated(() => {
  dropdownWrapper.value?.classList.add("__dropdown-wrapper", props.position);
});

onMounted(() => {
  dropdownWrapper.value?.classList.add("__dropdown-wrapper", props.position);
})

function showHide() {
  if(!dropdownWrapper.value) return
  const height = [...dropdownWrapper.value.children].reduce((sum, el) => el.clientHeight + sum, 0)
  
  if(!openDropdown.value) {
    dropdownWrapper.value.style.setProperty('display', 'none')
    dropdownWrapper.value.style.height = `${height}px`
  } else {
    dropdownWrapper.value.style.removeProperty('display')
  }
}

onMounted(showHide)
watch(openDropdown, showHide)
</script>
<template>
  <div @click.prevent.stop="() => {}" class="relative">
    <slot :toggle="toggle" :setRef="setRef" />
  </div>
</template>

<style>
.__dropdown-wrapper {
  top: 125%;
  position: absolute;
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-auto-rows: max-content;
}

.right-bottom {
  right: 0;
  bottom: 0;
}

.left-bottom {
  left: 0;
  bottom: 0;
}
</style>