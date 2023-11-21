<template>
  <div class="relative flex items-center justify-center bg-warm-200">
    <img src="@/assets/images/border_top.svg" alt="border top" class="z-10 absolute -top-1 left-0 w-full" />
    <img src="@/assets/images/border_right.svg" alt="border right"
      class="z-10 absolute -top-1 -right-1 h-[110%] fit-none" />
    <img src="@/assets/images/border_bottom.svg" alt="border bottom" class="z-10 absolute -bottom-1 -left-1 w-full" />
    <img src="@/assets/images/border_left.svg" alt="border left" class="z-10 absolute -top-1 -left-1 h-full" />

    <!-- Title -->
    <VDropdown v-if="type === 'radio'" auto borderless>
      <p class="w-max text-center p-3" :class="[value ? 'text-black' : 'text-warm-600']">{{ value ? value : placeholder }}
      </p>
      <template #popper="{ hide }">
        <span class="flex gap-3 py-2 px-3">
          <label class="font-bold font-serif text-sm md:text-lg" for="mr">Mr.</label>
          <input class="" :name="label" id="mr" value="Mr." type="radio" v-model="value" @click="formStore.title = 'Mr.'; hide()" />
          <label class="font-bold font-serif text-sm md:text-lg" for="ms">Ms.</label>
          <input class="" :name="label" id="ms" value="Ms." type="radio" v-model="value" @click="formStore.title = 'Ms.'; hide()" />
          <label class="font-bold font-serif text-sm md:text-lg" for="mrs">Mrs.</label>
          <input class="" :name="label" id="mrs" value="Mrs." type="radio" v-model="value" @click="formStore.title = 'Mrs.'; hide()" />
        </span>
      </template>
    </VDropdown>

    <!-- Purpose -->
    <VTooltip class="w-full" theme="grid" v-else-if="type === 'purpose'" auto borderless>
      <span class="flex items-center justify-center">
        <input @input="e => onInput(e)" class="p-3 w-full placeholder:text-warm-600" v-model="value" :placeholder="placeholder" :required="required" />
      </span>
      <template #popper="{ hide }">
        <div class="py-2 px-3 grid grid-cols-2 gap-1">
          <button class="font-bold font-serif text-sm md:text-lg" @click="value = purpose.purposeNameEn; formStore.purpose = value; hide()" v-for="purpose in purposes">
            {{ purpose.purposeNameEn }}
          </button>
        </div>
      </template>
    </VTooltip>

    <!-- Others -->
    <input v-else @input="e => onInput(e)" class="p-3 w-full placeholder:text-warm-600" :type="type" :label="label"
      v-model="value" :required="required" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
import type { VTooltip } from 'floating-vue';

type label = 'name' | 'title' | 'email' | 'phone' | 'notes' | 'date' | 'guests'

const formStore = useFormStore();
const value = ref();

function onInput(e: Event) {
  formStore[props.label as label] = value.value;
}

export interface Props {
  default?: any
  type: string
  label: string
  purposes?: purpose[]
  placeholder?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

if (props.default) value.value = props.default

</script>

<style scoped>
input[type=radio] {
  display: none;
}
</style>