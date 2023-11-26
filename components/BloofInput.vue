<template>
  <div ref="bloofInput" class="relative flex items-center justify-center">
    <!-- <img src="/images/border_top.svg" alt="border top" class="z-10 absolute -top-1 left-0 w-full" />
    <img src="/images/border_right.svg" alt="border right"
      class="z-10 absolute -top-1 -right-1 h-[110%] fit-none" />
    <img src="/images/border_bottom.svg" alt="border bottom" class="z-10 absolute -bottom-1 -left-1 w-full" />
    <img src="/images/border_left.svg" alt="border left" class="z-10 absolute -top-1 -left-1 h-full" /> -->

    <!-- Title -->
    <VDropdown v-if="props.type === 'radio'" auto borderless>
      <p class="bordered w-max text-center p-3 bg-warm-200" :class="[value ? 'text-black' : 'text-warm-600']">{{ value ?
        value :
        props.placeholder }}
      </p>
      <template #popper="{ hide }">
        <span class="flex gap-3 py-2 px-3">
          <label class="font-bold font-serif text-sm md:text-lg" for="mr">Mr.</label>
          <input class="" :name="props.label" id="mr" value="Mr." type="radio" v-model="value"
            @click="formStore.title = 'Mr.'; hide()" />
          <label class="font-bold font-serif text-sm md:text-lg" for="ms">Ms.</label>
          <input class="" :name="props.label" id="ms" value="Ms." type="radio" v-model="value"
            @click="formStore.title = 'Ms.'; hide()" />
          <label class="font-bold font-serif text-sm md:text-lg" for="mrs">Mrs.</label>
          <input class="" :name="props.label" id="mrs" value="Mrs." type="radio" v-model="value"
            @click="formStore.title = 'Mrs.'; hide()" />
        </span>
      </template>
    </VDropdown>

    <!-- Purpose -->
    <VTooltip class="w-full" theme="grid" v-else-if="props.type === 'purpose'" auto borderless>
      <span class="flex items-center justify-center">
        <input @input="e => onInput(e)" class="p-3 w-full placeholder:text-warm-600" v-model="value"
          :placeholder="props.placeholder" :required="props.required" />
      </span>
      <template #popper="{ hide }">
        <div class="py-2 px-3 grid grid-cols-2 gap-1">
          <button class="font-bold font-serif text-sm md:text-lg"
            @click="value = purpose.purposeNameEn; formStore.purpose = value; hide()" v-for="purpose in props.purposes">
            {{ purpose.purposeNameEn }}
          </button>
        </div>
      </template>
    </VTooltip>

    <!-- Checkbox -->
    <span v-else-if="props.type === 'checkbox'" class="flex items-center gap-3">
      <div @click="value = !value; $emit('changeCheck', value)" class="bordered h-5 w-5 relative">
        <img v-if="value" class="scale-[200%] origin-bottom" src="/images/check.svg" alt="checked" />
      </div>
      <input type="checkbox" :id="props.label" :name="props.label"
        v-model="value" @change="(e) => {value = (e.currentTarget as HTMLInputElement).checked; $emit('changeCheck', value) }" />
      <label class="text-lg font-bold font-serif" :for="props.label">{{ props.placeholder }}</label>
    </span>
    <!-- Others -->
    <input v-else @input="e => onInput(e)" class="p-3 w-full placeholder:text-warm-600" :type="props.type"
      :label="props.label" v-model="value" :required="props.required" :placeholder="props.placeholder" />
  </div>
</template>

<script setup lang="ts">
import type { VTooltip } from 'floating-vue';

type label = 'name' | 'title' | 'email' | 'phone' | 'notes' | 'date' | 'guests'

const formStore = useFormStore();
const value = ref();
const bloofInput = ref();

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

if (props.default) value.value = props.default;

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

onMounted(() => {
  bloofInput.value.querySelectorAll('input, .bordered').forEach((el: HTMLInputElement) => {
    el.style.cssText = `
border-top-left-radius: ${getRandom(20, 350)}px 15px;
    border-top-right-radius: 15px ${getRandom(20, 300)}px;
    border-bottom-right-radius: ${getRandom(20, 300)}px 15px;
    border-bottom-left-radius: 15px ${getRandom(20, 300)}px;
    `
  })
})
</script>

<style scoped lang="scss">
input[type=radio],
input[type=checkbox] {
  display: none;
}

input,
.bordered {
  outline: solid 4px black;
}
</style>