<template>
  <div class="mydentist-app">
    <button @click="startaBankId">Starta BankId</button>

    <div
      id="w-node-_5ef4a456-78ee-3356-a721-49f53fdd5c23-2190bb79"
      class="minasidor-wrapper"
    >
      <h1
        id="w-node-_7774ae3b-e687-287a-81f9-e752ccf6179e-2190bb79"
        class="text-heading"
      >
        Aktuella bokningar
      </h1>
      <h1
        id="w-node-_4bdeeea9-8aa6-fb9b-74fc-6d0ad61cef22-2190bb79"
        class="text-heading"
      >
        Min journal
      </h1>

      <div class="times-wrapper">
        <div
          class="time-block"
          @click="handleTimeblockLeft(index)"
          v-for="(entry, index) of listBookings.data"
          :key="index"
        >
          <div class="block-title">
            {{ formattedDate(entry.attributes.dtend) }}
          </div>
          <img
            :src="index === showItemLeft ? base64svg(minus) : base64svg(plus)"
            alt=""
            class="time-block-icon"
          />
          <div
            class="time-block-content-wrapper"
            :class="{ active: index === showItemLeft }"
          >
            <div class="time-block-content">
              Plats: {{ entry.attributes.location }} <br />
              Pris: {{ entry.attributes.price }} <br />
              Information: {{ entry.attributes.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="times-wrapper">
        <div
          class="time-block"
          @click="handleTimeblockRight(index)"
          v-for="(entry, index) of listJournalEntries.data"
          :key="index"
        >
          <div class="block-title">
            {{ formattedDate(entry.attributes.signed_at) }} :
            {{ entry.attributes.entry_type }}
          </div>
          <img
            :src="index === showItemRight ? base64svg(minus) : base64svg(plus)"
            alt=""
            class="time-block-icon"
          />
          <div
            class="time-block-content-wrapper"
            :class="{ active: index === showItemRight }"
          >
            <div class="time-block-content">{{ entry.attributes.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BankIdClient } from "bankid";

import plus from "./images/plus.svg?raw";
import minus from "./images/minus.svg?raw";

export default {
  name: "Home",
  components: { BankIdClient },

  data() {
    return {
      apiBaseUrl: "https://api.ngine.se/webhook/mydentist/",
      getJournalEntries: "get-journal-entries",
      getBookings: "bookings",
      userName: "XkehuCfMZ!hU%8h=",
      userPass: "QH5EV=2hNc*LFjJd",
      listJournalEntries: [],
      listBookings: [],
      showItemLeft: false,
      showItemRight: false,
      plus: plus,
      minus: minus,
    };
  },

  async created() {
    console.clear();

    this.listJournalEntries = await this.getApiData(
      this.apiBaseUrl + this.getJournalEntries
    );
    this.listBookings = await this.getApiData(
      this.apiBaseUrl + this.getBookings
    );

    // console.log(
    //   "JOURNAL ENTRIES",
    //   JSON.parse(JSON.stringify(this.listJournalEntries))
    // );
    // console.log("BOOKINGS", JSON.parse(JSON.stringify(this.listBookings)));
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

    postApiData(urlEndpoint, data) {
      return new Promise((resolve, reject) => {
        var requestOptions = {
          method: "POST",
          headers: {
            // Accept: "*/*",
            // "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },

          body: data,
          redirect: "follow",
        };

        fetch(urlEndpoint, requestOptions)
          .then((response) => {
            if (!response.ok) throw new Error();
            return response.json();
          })
          .then((result) => {
            console.log(result);
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    base64svg(image) {
      return `data:image/svg+xml;base64,${btoa(image)}`;
    },

    formattedDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    },

    handleTimeblockLeft(index) {
      if (this.showItemLeft === index) {
        this.showItemLeft = false;
      } else {
        this.showItemLeft = index;
      }
    },

    handleTimeblockRight(index) {
      if (this.showItemRight === index) {
        this.showItemRight = false;
      } else {
        this.showItemRight = index;
      }
    },

    async startaBankId() {
      const token = "";
      const redirect = "";

      const res = await fetch("https://api.ipify.org?format=json");
      const ip = await res.json();
      // this.extraFields.clientip = ip.ip;

      console.log("IP", ip.ip);

      // postApiData(urlEndpoint, data) {

      // const data = {
      //   endUserIp: ip.ip,
      // };

      const data = {
        endUserIp: "192.168.134.213",
      };

      const neger = await this.postApiData(
        "https://appapi2.test.bankid.com/rp/v6.0/auth",
        data
      );

      // console.log(neger);

      // window.location.href = `bankid:///?autostarttoken=${token}&redirect=${redirect}`;
    },

    async startBankId() {
      const client = new BankIdClient();
      // const pno = "200008102394";

      // const res = await fetch("https://api.ipify.org?format=json");
      // const ip = await res.json();

      // console.log("IP", ip.ip);

      // client
      //   .authenticateAndCollect({
      //     personalNumber: pno,
      //     endUserIp: ip.ip,
      //   })
      //   .then((res) => console.log(res.completionData))
      //   .catch(console.error);
    },
  },
};
</script>

<style scoped>
.time-block-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms;
}

.time-block-content-wrapper.active {
  grid-template-rows: 1fr;
}

.time-block-content {
  overflow: hidden;
}
</style>
