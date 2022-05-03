<script setup lang="ts">
import RadioButton from 'primevue/radiobutton';

const props = defineProps({
  name: String,
  text: String,
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const emitNewValue = (event: Event) => {
  emit('update:modelValue', event);
};
</script>

<template>
  <div
    @click="emit('update:modelValue', props.name)"
    class="py-4 px-8 surface-card border-round text-center cursor-pointer grow"
  >
    <div class="floating-checkbox">
      <RadioButton
        :value="name"
        :name="name"
        :aria-label="text"
        :modelValue="modelValue"
        @update:modelValue="emitNewValue"
      />
    </div>
    <span> {{ text }} </span>
  </div>
</template>

<style scoped lang="scss">
.grow {
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(100%);
  }
}
.floating-checkbox {
  position: absolute;
  top: 8px;
  right: 16px;

  input[type='radio'] {
    box-sizing: border-box;
    appearance: none;
    background: white;
    outline: 1px solid transparent;
    border: 2px solid white;
    width: 16px;
    height: 16px;

    &:checked {
      background: #333;
    }
  }
}
</style>
