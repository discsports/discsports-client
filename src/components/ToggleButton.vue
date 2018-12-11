<!-- client/src/components/ToggleButton.vue -->

<template>
  <button type="button" class="btn btn-primary"
  ref="btn1"
  @click="toggle"
  :class="{toggled: pressed}"
  :aria-pressed="pressed">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'toggle-button',
  props: {
    label: {
      type: String,
      required: true,
    },
    initialPressed: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      pressed: false,
    };
  },
  mounted() {
    this.pressed = this.initialPressed;
  },
  methods: {
    toggle() {
      this.pressed = !this.pressed;
      this.$refs.btn1.blur();
    },
    reset() {
      this.pressed = false;
      this.$refs.btn1.blur();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toggled {
  background-image: -webkit-gradient(linear, left top, left bottom,
  from(#1B1D1F), color-stop(40%, #232629), to(#272B2E));
  background-image: linear-gradient(#1B1D1F, #232629 40%, #272B2E);
  background-repeat: no-repeat;
  -webkit-filter: none;
          filter: none;
}
</style>
