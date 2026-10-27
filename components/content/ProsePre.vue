<template>
  <!-- tabindex: long lines scroll sideways, and keyboard users need to reach that scroll -->
  <pre :class="$props.class" :style="style" tabindex="0"><slot /></pre>
</template>

<script setup lang="ts">
defineProps({
  code: { type: String, default: "" },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  highlights: { type: Array as () => number[], default: () => [] },
  meta: { type: String, default: null },
  class: { type: String, default: null },
  style: { type: [String, Object], default: null },
});
</script>
