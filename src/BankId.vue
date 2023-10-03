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
          />
        </div>
        <input
          type="submit"
          value="Logga in"
          data-wait="Var god vänta..."
          class="bankid-login w-button"
          @click="startBankId"
        />

        <div class="w-form-done">
          <div>Thank you! Your submission has been received!</div>
        </div>
        <div class="w-form-fail">
          <div>Oops! Something went wrong while submitting the form.</div>
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
      userName: "XkehuCfMZ!hU%8h=",
      userPass: "QH5EV=2hNc*LFjJd",
      personNummer: null,
      message: "",
    };
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
      console.log("START BANKID");

      const token = await this.getApiData(this.apiBaseUrl + this.getBankidAuth);
      const returnUrl = "https://www.ngine.se";
      console.log(token.autoStartToken);

      if (/Mobi|Android/i.test(navigator.userAgent)) {
        // This is a mobile device
        console.log("Mobile device detected");
        this.message = "Mobile device detected";

        // window.location.href = `https://app.bankid.com/?autostarttoken=${token.autoStartToken}&redirect=${returnUrl}`;
      } else {
        // This is a desktop device
        console.log("Desktop device detected");
        this.message = "Desktop device detected";

        // window.location.href = `bankid:///?autostarttoken=${token.autoStartToken}&redirect=${returnUrl}`;
      }
    },
  },

  watch: {
    personNummer() {
      console.log("PERSONNUMMER", this.personNummer);
    },
  },
};
</script>
