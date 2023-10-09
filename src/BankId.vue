<style scoped>
@import "./css/components.css";
@import "./css/mydentist-apps.css";
</style>

<template>
  <div class="mydentist-app">
    <div
      id="w-node-_5ef4a456-78ee-3356-a721-49f53fdd5c23-4be37fed"
      class="bankid-login-container"
    >
      <div
        id="w-node-_448361be-a014-de81-b070-c3ae9981ce14-4be37fed"
        class="bankid-login-wrapper"
      >
        <img src="./images/BankID_logo.png" alt="" class="bankid-logo" />
        <div v-if="qrStarted || qrMode === false">{{ modeInstructions }}</div>

        <template v-if="qrMode">
          <div v-if="qrStarted" class="qr-wrapper">
            <qrcode-vue
              v-if="qrValue"
              :value="qrValue"
              :size="qrSize"
              level="H"
            />
            <Vue3Lottie
              v-if="!qrValue"
              :animationData="loading"
              :height="100"
              :width="100"
            />
          </div>

          <input
            v-if="!qrStarted"
            type="submit"
            value="Logga in med mobilt BankID"
            data-wait="Var god vänta..."
            class="bankid-login w-button"
            @click="startBankIdQr"
          />
        </template>

        <template v-else>
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
            :style="{
              color: isValidInput(personNummer)
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(255, 255, 255, 0.5)',
            }"
            :disabled="!isValidInput(personNummer)"
          />
        </template>

        <div @click="switchLoginMode" class="select-other-input">
          {{ chooseMode }}
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
import { Vue3Lottie } from "vue3-lottie";
import loading from "./images/loading.json";

export default {
  name: "BankId",
  components: { userSolid, QrcodeVue, Vue3Lottie },

  data() {
    return {
      apiBaseUrl: "https://api.ngine.se/webhook/mydentist/",
      getBankidAuth: "bankid/auth",
      getBankidQr: "bankid/qr",
      getBankidCollect: "bankid/collect",
      userName: "XkehuCfMZ!hU%8h=",
      userPass: "QH5EV=2hNc*LFjJd",
      personNummer: null,
      ip: null,
      collectInterval: null,
      collectQrInterval: null,
      isLoginError: false,
      modeInstructions: "",
      modeInstructionsNumber: "Person-/Organisationsnummer",
      modeInstructionsQR: "Scanna QR-koden med BankID på din externa enhet",
      chooseMode: "",
      chooseModeDirect: "Logga in med ert personnummer",
      chooseModeQR: "Logga in med Mobilt BankID",
      errorMessage: "Inloggningen misslyckades, var god försök igen!",
      qrValue: "",
      qrSize: 256,
      qrMode: true,
      qrStarted: false,
      loading,
    };
  },

  async created() {
    this.modeInstructions = this.modeInstructionsQR;
    this.chooseMode = this.chooseModeDirect;

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

    async startBankId(event) {
      const orgLabel = event.target.value;
      event.target.value = event.target.getAttribute("data-wait");

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

      event.target.value = orgLabel;
    },

    async startBankIdQr() {
      this.qrStarted = true;

      if (!this.qrStarted) return;

      const token = await this.getApiData(
        this.apiBaseUrl + this.getBankidAuth + "?ip=" + this.ip
      );

      this.startBankidCollect(token);
      this.startBankidQrGenerator(token);
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

          if (!this.qrValue) {
            // direct
            this.authorizeMinaSidor(collect);
          } else {
            // qr
            this.$emit("access", {
              auth: true,
              orderRef: collect.orderRef,
            });
          }
        } else if (collect.status === "failed") {
          this.stopBankidCollect();
          this.generateError();
        }
      }, 2000);
    },

    async startBankidQrGenerator(token) {
      this.collectQrInterval = setInterval(async () => {
        const collect = await this.getApiData(
          this.apiBaseUrl + this.getBankidQr + "?orderRef=" + token.orderRef
        );

        this.qrValue = collect.qr_data;
      }, 1000);
    },

    stopBankidCollect() {
      clearInterval(this.collectInterval);
      clearInterval(this.collectQrInterval);
    },

    authorizeMinaSidor(collect) {
      if (
        this.personNummer.toString() ===
        collect.completionData.user.personalNumber
      ) {
        this.$emit("access", {
          auth: true,
          orderRef: collect.orderRef,
        });
      } else {
        this.$emit("access", {
          auth: false,
          orderRef: null,
        });
        this.generateError();
      }
    },

    generateError() {
      this.isLoginError = true;
      this.qrValue = "";
      this.qrMode = true;
      this.qrStarted = false;

      setTimeout(() => {
        this.isLoginError = false;
      }, 10000);
    },

    isValidInput(input) {
      var pattern = /^\d{12}$/;
      return pattern.test(input);
    },

    switchLoginMode() {
      this.qrMode = !this.qrMode;
    },
  },

  watch: {
    qrMode() {
      this.stopBankidCollect();

      if (this.qrMode) {
        this.chooseMode = this.chooseModeDirect;
        this.modeInstructions = this.modeInstructionsQR;
      } else {
        this.chooseMode = this.chooseModeQR;
        this.modeInstructions = this.modeInstructionsNumber;
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  display: block;
}
</style>
