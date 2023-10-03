<template>
  <BankId @access="authStatus" v-if="!isAuthorized" />
  <MinaSidor v-if="isAuthorized" />
</template>

<script>
import MinaSidor from "./MinaSidor.vue";
import BankId from "./BankId.vue";

export default {
  name: "App",
  components: { MinaSidor, BankId },

  data() {
    return {
      isAuthorized: false,
    };
  },

  methods: {
    authStatus(value) {
      this.isAuthorized = value;
    },
  },
};
</script>
