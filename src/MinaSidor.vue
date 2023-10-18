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
      <div>
        <div class="times-wrapper">
          <h1
            id="w-node-_7774ae3b-e687-287a-81f9-e752ccf6179e-2190bb79"
            class="text-heading full"
          >
            Aktuella bokningar
          </h1>

          <div
            class="time-block"
            @click="handleTimeblockBookings(index)"
            v-for="(entry, index) of listBookings.data.slice(
              0,
              numberOfBookings
            )"
            :key="index"
          >
            <div
              :class="[
                index === showItemBookings
                  ? 'block-title hover'
                  : 'block-title',
              ]"
            >
              {{ formattedDate(entry.attributes.dtend) }} :
              {{ entry.attributes.text }}
            </div>
            <minus
              v-if="index === showItemBookings"
              style="color: #9b1373"
              class="time-block-icon"
            />
            <plus v-else style="color: #9b1373" class="time-block-icon" />

            <div
              class="time-block-content-wrapper"
              :class="{ active: index === showItemBookings }"
            >
              <div class="time-block-content">
                Plats: {{ entry.attributes.location }} <br />
                Information: {{ entry.attributes.text }}
              </div>
            </div>
          </div>

          <button
            v-if="
              listBookings.data.length !== 0 &&
              !disableLoadMoreBookings &&
              listBookings.data.length > numberOfBookings
            "
            @click="loadMoreBookings"
            class="button-mina-sidor w-button"
          >
            Ladda fler
          </button>

          <div v-if="listBookings.data.length === 0" class="time-block-empty">
            Vi hittade inga aktuella bokningar.
          </div>
        </div>

        <div class="times-wrapper">
          <h1
            id="w-node-_4bdeeea9-8aa6-fb9b-74fc-6d0ad61cef22-2190bb79"
            class="text-heading fakturor"
          >
            Mina fakturor
          </h1>

          <div
            class="time-block"
            @click="handleTimeblockInvoices(index)"
            v-for="(entry, index) of listInvoices.data.slice(
              0,
              numberOfInvoices
            )"
            :key="index"
          >
            <div
              :class="[
                index === showItemInvoices
                  ? 'block-title hover'
                  : 'block-title',
              ]"
            >
              {{ formattedDate(entry.attributes.invoice_date) }} :
              {{ entry.attributes.amount.toFixed(2) }} kr
            </div>
            <minus
              v-if="index === showItemInvoices"
              style="color: #9b1373"
              class="time-block-icon"
            />
            <plus v-else style="color: #9b1373" class="time-block-icon" />
            <div
              class="time-block-content-wrapper"
              :class="{ active: index === showItemInvoices }"
            >
              <div class="time-block-content">
                Summa: {{ entry.attributes.amount.toFixed(2) }} kr<br />
                Klinikens address:
                {{ entry.attributes.organization_street_address_1 }}
              </div>
            </div>
          </div>

          <button
            v-if="
              listInvoices.data.length !== 0 &&
              !disableLoadMoreInvoices &&
              listInvoices.data.length > numberOfInvoices
            "
            @click="loadMoreInvoices"
            class="button-mina-sidor w-button"
          >
            Ladda fler
          </button>

          <div v-if="listInvoices.data.length === 0" class="time-block-empty">
            Vi hittade inga fakturor.
          </div>
        </div>
      </div>

      <div class="times-wrapper">
        <h1
          id="w-node-_4bdeeea9-8aa6-fb9b-74fc-6d0ad61cef22-2190bb79"
          class="text-heading"
        >
          Min journal
        </h1>

        <div
          class="time-block"
          @click="handleTimeblockJournal(index)"
          v-for="(entry, index) of listJournal.data.slice(0, numberOfJournal)"
          :key="index"
        >
          <div
            :class="[
              index === showItemJournal ? 'block-title hover' : 'block-title',
            ]"
          >
            {{ formattedDate(entry.attributes.signed_at) }} :
            {{ entry.attributes.entry_type }}
          </div>
          <minus
            v-if="index === showItemJournal"
            style="color: #9b1373"
            class="time-block-icon"
          />
          <plus v-else style="color: #9b1373" class="time-block-icon" />
          <div
            class="time-block-content-wrapper"
            :class="{ active: index === showItemJournal }"
          >
            <div class="time-block-content">{{ entry.attributes.text }}</div>
          </div>
        </div>

        <button
          v-if="
            listJournal.data.length !== 0 &&
            !disableLoadMoreJournal &&
            listJournal.data.length > numberOfJournal
          "
          @click="loadMoreJournal"
          class="button-mina-sidor w-button"
        >
          Ladda fler
        </button>

        <div v-if="listJournal.data.length === 0" class="time-block-empty">
          Vi hittade ingen journal.
        </div>
      </div>
    </div>

    <div v-if="loadingFlag && !apiError" class="minasidor-loading">
      <Vue3Lottie :animationData="loading" :height="100" :width="100" />
    </div>

    <div v-if="loadingFlag && apiError">
      <div>{{ apiErrorMessage }}</div>
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
      listJournal: { data: [] },
      listBookings: [],
      listInvoices: { data: [] },
      showItemBookings: false,
      showItemJournal: false,
      showItemInvoices: false,
      loadingFlag: true,
      loading,
      apiError: false,
      apiErrorMessage: "Något gick fel under laddningen av er profil.",
      numberOfJournal: 10,
      disableLoadMoreJournal: false,
      numberOfBookings: 5,
      disableLoadMoreBookings: false,
      numberOfInvoices: 5,
      disableLoadMoreInvoices: false,
    };
  },

  async created() {
    const journalBookings = await this.getApiData(
      this.apiBaseUrl + this.getJournalBookings + "?orderRef=" + this.orderRef
    );

    // filter out admin posts
    for (const item of journalBookings.data[0].data) {
      if (item.attributes.entry_type !== "admin") {
        this.listJournal.data.push(item);
      }
    }

    this.listJournal.data = this.sortList(this.listJournal.data);

    this.listBookings = journalBookings.data[1];
    this.listBookings.data = this.sortList(this.listBookings.data);

    // filter out invoices and add information from clinic
    if (journalBookings.data[2]) {
      for (const invoice of journalBookings.data[2].data) {
        for (const item of journalBookings.data[2].included) {
          if (item.type === "payment_per_invoice") {
            for (const payment of invoice.relationships.payments_per_invoices
              .data) {
              if (item.id === payment.id) {
                let data = item;
                data.attributes = { ...data.attributes, ...invoice.attributes };
                this.listInvoices.data.push(data);
              }
            }
          }
        }
      }
    }

    this.listInvoices.data = this.sortList(this.listInvoices.data);

    this.handleTimeblockBookings(0);
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
            // console.log(error);

            this.apiError = true;
            reject(error);
          });
      });
    },

    formattedDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    },

    handleTimeblockBookings(index) {
      if (this.showItemBookings === index) {
        this.showItemBookings = false;
      } else {
        this.showItemBookings = index;
      }
    },

    handleTimeblockJournal(index) {
      if (this.showItemJournal === index) {
        this.showItemJournal = false;
      } else {
        this.showItemJournal = index;
      }
    },

    handleTimeblockInvoices(index) {
      if (this.showItemInvoices === index) {
        this.showItemInvoices = false;
      } else {
        this.showItemInvoices = index;
      }
    },

    loadMoreJournal() {
      this.numberOfJournal += 10;

      if (this.numberOfJournal >= parseInt(this.listJournal.data.length)) {
        this.disableLoadMoreJournal = true;
      }
    },

    loadMoreBookings() {
      this.numberOfBookings += 5;

      if (this.numberOfBookings >= parseInt(this.listBookings.data.length)) {
        this.disableLoadMoreBookings = true;
      }
    },

    loadMoreInvoices() {
      this.numberOfInvoices += 5;

      if (this.numberOfInvoices >= parseInt(this.listInvoices.data.length)) {
        this.disableLoadMoreInvoices = true;
      }
    },

    sortList(listData) {
      listData.sort((a, b) => {
        const dateA = new Date(a.attributes.invoice_date);
        const dateB = new Date(b.attributes.invoice_date);
        return dateB - dateA; // Descending order
      });

      return listData;
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
