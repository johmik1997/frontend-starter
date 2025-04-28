<script setup>
import icons from "@/utils/icons";
import InputParent from "../new_form_builder/InputParent.vue";
//import Icon from "../Icon.vue";
import InputLayout from "./NewInputLayout.vue";

const props = defineProps({
  obj: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <InputParent v-slot="{ setRef, error, validation, value, attributes, changeValue }">
    <InputLayout
      :validation="validation"
      :class="$attrs.class + ' relative'"
      :error="error"
      :label="$attrs.label"
    >
      <div class="flex items-center h-full flex-1">
        <slot name="left"></slot>
        <select
          :style="{
            opacity: attributes?.placeholder && !value ? .6 : 1
          }"
          :ref="setRef"
          class="appearance-none flex-1 bg-inherit mt-3 ml-2 justify-center text-text-clr h-full text-sm focus:outline-none"
        >
          <option
            selected
            value=""
            disabled
            class="text-text-clr opacity-60 bg-inherit"
            style="background-color: inherit !important;"
          >
            {{ attributes?.placeholder }}
          </option>
          <template v-if="!obj">
            <option
              class="text-sm px-4"
              :selected="value == option"
              :key="option"
              v-for="option in options"
            >
              {{ option }}
            </option>
          </template>
          <template v-else>
            <option
              class="text-sm px-4"
              :selected="value == option.value"
              :key="option.value"
              :value="option.value"
              v-for="option in options"
            >
              {{ option.label }}
            </option>
          </template>
        </select>
        <slot name="right"></slot>
      </div>
    </InputLayout>
  </InputParent>
</template>

<style>


select option {
  background-color: white !important;
}


</style>

