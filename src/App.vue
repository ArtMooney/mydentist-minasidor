<template>
  <BankId />
  <MinaSidor />
</template>

<script>
import MinaSidor from "./MinaSidor.vue";
import BankId from "./BankId.vue";

export default {
  name: "App",
  components: { MinaSidor, BankId },
};
</script>
