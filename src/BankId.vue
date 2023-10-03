<style scoped>
@import "./css/components.css";
@import "./css/mydentist-apps.css";
</style>

<template>
  <div class="mydentist-app">
    <h3 style="background-color: coral">{{ message }}</h3>
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
import userSolid from "./images/user-solid.vue";

export default {
  name: "BankId",
  components: { userSolid },

  data() {
    return {
      apiBaseUrl: "https://api.ngine.se/webhook/mydentist/",
      getBankidAuth: "bankid/auth",
      getBankidCollect: "bankid/collect",
      userName: "XkehuCfMZ!hU%8h=",
      userPass: "QH5EV=2hNc*LFjJd",
      personNummer: null,
      collectInterval: null,
      isLoginError: false,
      errorMessage: "Inloggningen misslyckades, var god försök igen!",
      message: "Test v0.0.1",
    };
  },

  created() {
    if (localStorage.getItem("U3>s^$9PX?V8Qzhv(yk_Zn") !== null) {
      const localToken = JSON.parse(
        localStorage.getItem("U3>s^$9PX?V8Qzhv(yk_Zn")
      );

      this.message = "REROUTED" + JSON.stringify(localToken);

      // this.startBankidCollect(localToken);
      localStorage.removeItem("U3>s^$9PX?V8Qzhv(yk_Zn");
    }
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
      const token = await this.getApiData(this.apiBaseUrl + this.getBankidAuth);
      const returnUrl = window.location.href;
      // const returnUrl = "";

      this.startBankidCollect(token);

      if (/Mobi|Android/i.test(navigator.userAgent)) {
        // mobile device
        this.message = "Mobile device detected";
        // localStorage.setItem("U3>s^$9PX?V8Qzhv(yk_Zn", JSON.stringify(token));

        window.location.href = `https://app.bankid.com/?autostarttoken=${token.autoStartToken}&redirect=${returnUrl}`;
      } else {
        // desktop device
        this.message = "Desktop device detected";

        window.location.href = `bankid:///?autostarttoken=${token.autoStartToken}&redirect=${returnUrl}`;
      }
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
          localStorage.setItem("U3>s^$9PX?V8Qzhv(yk_Zn", "complete");
          this.authorizeMinaSidor(collect);
        } else if (collect.status === "failed") {
          this.stopBankidCollect();
          localStorage.setItem("U3>s^$9PX?V8Qzhv(yk_Zn", "failed");

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
