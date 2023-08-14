<style>
@import "./css/normalize.css";
@import "./css/components.css";
@import "./css/mydentist-apps.css";
</style>

<template>
  <MinaSidor />

  <!-- <div>
    <router-view />
  </div> -->
</template>

<script>
import MinaSidor from "./MinaSidor.vue";

export default {
  name: "App",
  components: { MinaSidor },
};
</script>
