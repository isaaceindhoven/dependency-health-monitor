<script setup lang="ts">
const props = defineProps({
  name: String,
  text: String,
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const emitNewValue = (event) => {
  console.log(event);

  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div
    @click="emit('update:modelValue', props.name)"
    class="p-4 p-component border-round bg-primary text-center cursor-pointer grow"
  >
    <div class="floating-checkbox">
      <input
        class="border-round cursor-pointer"
        type="radio"
        :aria-label="text"
        :checked="modelValue == name"
        :name="name"
        :value="name"
        @input="emitNewValue"
      />
    </div>
    <span> {{ text }} </span>
  </div>
</template>

<style scoped lang="scss">
.grow {
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(105%);
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
