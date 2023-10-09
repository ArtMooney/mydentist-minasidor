<template>
  <BankId @access="authStatus" v-if="!isAuthorized" />
  <MinaSidor v-if="isAuthorized" :orderRef="orderRef" />
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
      orderRef: null,
    };
  },

  methods: {
    authStatus({ auth, orderRef }) {
      this.isAuthorized = auth;
      this.orderRef = orderRef;
    },
  },
};
</script>
