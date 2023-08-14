<template>
  <div class="mydentist-app">
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
      <div
        id="w-node-_67bf3200-704d-3b6e-f47e-d3936cd845e7-2190bb79"
        class="times-container"
      >
        <div class="times-wrapper">
          <div class="time-block">
            <div class="block-title">DD / MM - YY : MM : Undersökning</div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at
              sagittis purus. Proin tincidunt lacus quis justo fermentum, non
              vestibulum dui pellentesque. Nullam auctor justo vel elit
              consectetur, a pulvinar nibh vestibulum. Sed non consequat purus.
              Nulla facilisi. Nunc volutpat arcu a libero sollicitudin, eu
              consequat lectus faucibus. Sed euismod, libero sed tincidunt
              congue, elit elit bibendum elit, ut condimentum odio augue id
              quam. Nulla facilisi.
            </div>
            <img
              :src="base64svg(minus)"
              loading="lazy"
              alt=""
              class="time-block-icon"
            />
          </div>
          <div class="time-block">
            <div class="block-title">DD / MM - YY : MM : Tandblekning</div>
            <img
              :src="base64svg(plus)"
              loading="lazy"
              alt=""
              class="time-block-icon"
            />
          </div>
        </div>
      </div>
      <div
        id="w-node-_26a306be-2192-95d0-49da-c3d6cf12b93a-2190bb79"
        class="times-container"
      >
        <div class="times-wrapper">
          <div class="time-block">
            <div class="block-title">DD / MM - YY : MM : Tandblekning</div>
            <img
              :src="base64svg(plus)"
              loading="lazy"
              alt=""
              class="time-block-icon"
            />
          </div>
          <div class="time-block">
            <div class="block-title">DD / MM - YY : MM : Tandblekning</div>
            <img
              :src="base64svg(plus)"
              loading="lazy"
              alt=""
              class="time-block-icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import plus from "./images/plus.svg?raw";
import minus from "./images/minus.svg?raw";

export default {
  name: "Home",

  data() {
    return {
      apiBaseUrl: "https://api.ngine.se/webhook/mydentist/",
      getListClinics: "get-clinics",
      getListProcedures: "get-procedures",
      getListCaregivers: "get-caregivers",
      getListBookings: "get-bookings",
      userName: "XkehuCfMZ!hU%8h=",
      userPass: "QH5EV=2hNc*LFjJd",
      dropdownClinics: false,
      dropdownProcedures: false,
      dropdownCaregivers: false,
      chosenClinic: "-",
      chosenProcedure: "-",
      chosenCaregiver: "-",
      listClinics: [],
      listProcedures: [],
      listCaregivers: [],
      listBookings: [],
      plus: plus,
      minus: minus,
    };
  },

  async created() {
    console.clear();

    this.listClinics = await this.getApiData(
      this.apiBaseUrl + this.getListClinics
    );
    this.listProcedures = await this.getApiData(
      this.apiBaseUrl + this.getListProcedures
    );
    this.listCaregivers = await this.getApiData(
      this.apiBaseUrl + this.getListCaregivers
    );

    // console.log("CLINICS", JSON.parse(JSON.stringify(this.listClinics)));
    // console.log("PROCEDURES", JSON.parse(JSON.stringify(this.listProcedures)));
    // console.log("CAREGIVERS", JSON.parse(JSON.stringify(this.listCaregivers)));

    this.initQueries();
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

    handledropdownClinics() {
      this.dropdownClinics = !this.dropdownClinics;

      if (this.dropdownClinics) {
        this.dropdownProcedures = false;
        this.dropdownCaregivers = false;
      }
    },

    handledropdownProcedures() {
      this.dropdownProcedures = !this.dropdownProcedures;

      if (this.dropdownProcedures) {
        this.dropdownClinics = false;
        this.dropdownCaregivers = false;
      }
    },

    handledropdownCaregivers() {
      this.dropdownCaregivers = !this.dropdownCaregivers;

      if (this.dropdownCaregivers) {
        this.dropdownClinics = false;
        this.dropdownProcedures = false;
      }
    },

    handleClinics(event) {
      this.chosenClinic = event.target.innerText;
      this.updateQueryString();
    },

    handleProcedures(event) {
      this.chosenProcedure = event.target.innerText;
      this.updateQueryString();
    },

    handleCaregivers(event) {
      this.chosenCaregiver = event.target.innerText;
      this.updateQueryString();
    },

    getQueryString() {
      let queryString = "?";

      if (this.chosenClinic && this.chosenClinic !== "-") {
        queryString = queryString + "clinic=" + this.chosenClinic;
      }

      if (this.chosenProcedure && this.chosenProcedure !== "-") {
        queryString = queryString !== "?" ? queryString + "&" : queryString;
        queryString = queryString + "procedure=" + this.chosenProcedure;
      }

      if (this.chosenCaregiver && this.chosenCaregiver !== "-") {
        queryString = queryString !== "?" ? queryString + "&" : queryString;
        queryString = queryString + "caregiver=" + this.chosenCaregiver;
      }

      if (queryString === "?") queryString = "";

      return queryString;
    },

    handleBooking() {
      const queryString = this.getQueryString();

      // window.location.href = "/boka" + queryString;
      this.$router.push("/boka" + queryString);
    },

    updateQueryString() {
      const url = window.location.href;
      const searchString = "/boka";

      // only update querystring if we are on the /boka page
      if (url.indexOf(searchString) !== -1) {
        const queryString = this.getQueryString();

        history.pushState({}, "", "/boka" + queryString);
      }
    },

    initQueries() {
      const urlString = window.location.href;

      if (urlString.indexOf("?") !== -1) {
        const queryString = urlString.split("?")[1].split("&");

        for (const [index, query] of queryString.entries()) {
          queryString[index] = decodeURIComponent(query);
        }

        for (const query of queryString) {
          const command = query.split("=");

          if (command[0] === "clinic") {
            this.chosenClinic = command[1];
          }

          if (command[0] === "procedure") {
            this.chosenProcedure = command[1];
          }

          if (command[0] === "caregiver") {
            this.chosenCaregiver = command[1];
          }
        }
      }
    },

    base64svg(image) {
      return `data:image/svg+xml;base64,${btoa(image)}`;
    },
  },
};
</script>

<style scoped>
.column {
  user-select: none;
}
</style>
