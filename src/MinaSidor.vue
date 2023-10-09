<style scoped>
@import "./css/components.css";
@import "./css/mydentist-apps.css";
</style>

<template>
  <div class="mydentist-app">
    <div
      v-if="!loadingFlag"
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
          <minus
            v-if="index === showItemLeft"
            style="color: #9b1373"
            class="time-block-icon"
          />
          <plus v-else style="color: #9b1373" class="time-block-icon" />

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

        <div v-if="listBookings.data.length === 0" class="time-block-empty">
          Vi hittade inga aktuella bokningar.
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
          <minus
            v-if="index === showItemRight"
            style="color: #9b1373"
            class="time-block-icon"
          />
          <plus v-else style="color: #9b1373" class="time-block-icon" />
          <div
            class="time-block-content-wrapper"
            :class="{ active: index === showItemRight }"
          >
            <div class="time-block-content">{{ entry.attributes.text }}</div>
          </div>
        </div>

        <div
          v-if="listJournalEntries.data.length === 0"
          class="time-block-empty"
        >
          Vi hittade ingen journal.
        </div>
      </div>
    </div>

    <div v-if="loadingFlag" class="minasidor-loading">
      <Vue3Lottie :animationData="loading" :height="100" :width="100" />
    </div>
  </div>
</template>

<script>
import { Vue3Lottie } from "vue3-lottie";
import loading from "./images/loading.json";
import plus from "./images/plus.vue";
import minus from "./images/minus.vue";

export default {
  name: "MinaSidor",
  components: { Vue3Lottie, plus, minus },

  props: {
    orderRef: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      apiBaseUrl: "https://api.ngine.se/webhook/mydentist/",
      getJournalBookings: "journal-bookings",
      userName: "XkehuCfMZ!hU%8h=",
      userPass: "QH5EV=2hNc*LFjJd",
      listJournalEntries: [],
      listBookings: [],
      showItemLeft: false,
      showItemRight: false,
      loadingFlag: true,
      loading,
    };
  },

  async created() {
    const journalBookings = await this.getApiData(
      this.apiBaseUrl + this.getJournalBookings + "?orderRef=" + this.orderRef
    );

    this.listJournalEntries = journalBookings.data[0];
    this.listBookings = journalBookings.data[1];

    // console.log("JOURNAL BOOKINGS", journalBookings);
    // console.log("JOURNAL", JSON.parse(JSON.stringify(this.listJournalEntries)));
    // console.log("BOOKINGS", JSON.parse(JSON.stringify(this.listBookings)));

    this.loadingFlag = false;
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
