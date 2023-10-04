<style scoped>
@import "./css/components.css";
@import "./css/mydentist-apps.css";
</style>

<template>
  <div class="mydentist-app">
    <h3 style="background-color: coral">{{ message }}</h3>
    <h3 style="background-color: coral">{{ message2 }}</h3>
    <div
      id="w-node-_5ef4a456-78ee-3356-a721-49f53fdd5c23-4be37fed"
      class="bankid-login-container"
    >
      <div
        id="w-node-_448361be-a014-de81-b070-c3ae9981ce14-4be37fed"
        class="bankid-login-wrapper"
      >
        <img src="./images/BankID_logo.png" alt="" class="bankid-logo" />
        <div>Person-/Organisationsnummer</div>

        <div class="bankid-input-wrapper">
          <userSolid style="color: #9b1473" class="bankid-input-user" />
          <input
            type="number"
            class="bankid-input w-input"
            maxlength="256"
            name="personnummer"
            data-name="personnummer"
            placeholder="YYYYMMDDNNNN"
            id="personnummer"
            v-model="personNummer"
            @click="isLoginError = false"
          />
        </div>
        <input
          type="submit"
          value="Logga in"
          data-wait="Var god vänta..."
          class="bankid-login w-button"
          @click="startBankId"
          :disabled="!isValidInput(personNummer)"
          :style="{
            color: isValidInput(personNummer)
              ? 'rgba(255, 255, 255, 1)'
              : 'rgba(255, 255, 255, 0.5)',
          }"
        />

        <div @click="loginQrCode" style="padding: 1rem">
          Logga in med annan enhet
        </div>

        <qrcode-vue :value="qrValue" :size="qrSize" level="H" />

        <div class="success-message w-form-done">
          <div>Thank you! Your submission has been received!</div>
        </div>
        <div v-if="isLoginError" class="error-message w-form-fail">
          <div>
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import userSolid from "./images/user-solid.vue";

export default {
  name: "BankId",
  components: { userSolid, QrcodeVue },

  data() {
    return {
      apiBaseUrl: "https://api.ngine.se/webhook/mydentist/",
      getBankidAuth: "bankid/auth",
      getBankidCollect: "bankid/collect",
      userName: "XkehuCfMZ!hU%8h=",
      userPass: "QH5EV=2hNc*LFjJd",
      personNummer: null,
      ip: null,
      collectInterval: null,
      isLoginError: false,
      errorMessage: "Inloggningen misslyckades, var god försök igen!",
      message: "Test v0.2.3",
      message2: "",
      qrValue:
        "bankid.67df3917-fa0d-44e5-b327-edcc928297f8.0.dc69358e712458a66a7525beef148ae8526b1c71610eff2c16cdffb4cdac9bf8",
      qrSize: 256,
    };
  },

  async created() {
    const res = await fetch("https://api.ipify.org?format=json");
    const ip = await res.json();
    this.ip = ip.ip;
  },

  methods: {
    getApiData(urlEndpoint) {
      return new Promise((resolve, reject) => {
        var requestOptions = {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa(this.userName + ":" + this.userPass),
          },
          redirect: "follow",
        };

        fetch(urlEndpoint, requestOptions)
          .then((response) => {
            if (!response.ok) throw new Error();
            return response.json();
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            console.log(error);

            reject(error);
          });
      });
    },

    async startBankId() {
      const token = await this.getApiData(
        this.apiBaseUrl + this.getBankidAuth + "?ip=" + this.ip
      );
      // const returnUrl = window.location.href;
      const returnUrl = "";

      this.startBankidCollect(token);

      if (/Mobi|Android/i.test(navigator.userAgent)) {
        // mobile device
        window.location.href = `https://app.bankid.com/?autostarttoken=${token.autoStartToken}&redirect=${returnUrl}`;
      } else {
        // desktop device
        window.location.href = `bankid:///?autostarttoken=${token.autoStartToken}&redirect=${returnUrl}`;
      }
    },

    loginQrCode() {
      console.log("HEJ");
    },

    startBankidCollect(token) {
      this.collectInterval = setInterval(async () => {
        const collect = await this.getApiData(
          this.apiBaseUrl +
            this.getBankidCollect +
            "?orderRef=" +
            token.orderRef
        );

        if (collect.status === "complete") {
          this.stopBankidCollect();

          this.authorizeMinaSidor(collect);
        } else if (collect.status === "failed") {
          this.stopBankidCollect();

          this.isLoginError = true;

          setTimeout(() => {
            this.isLoginError = false;
          }, 10000);
        }
      }, 2000);
    },

    stopBankidCollect() {
      clearInterval(this.collectInterval);
    },

    authorizeMinaSidor(collect) {
      if (
        this.personNummer.toString() ===
        collect.completionData.user.personalNumber
      ) {
        this.$emit("access", true);
      } else {
        this.$emit("access", false);
        this.isLoginError = true;

        setTimeout(() => {
          this.isLoginError = false;
        }, 10000);
      }
    },

    isValidInput(input) {
      var pattern = /^\d{12}$/;
      return pattern.test(input);
    },
  },
};
</script>

<style scoped>
.error-message {
  display: block;
}
</style>
