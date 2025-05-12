<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>
<template>
  <header>
    <div class="wrapper"></div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  justify-content: center;  /* Centers the header content horizontally */
  align-items: center;  /* Centers the header content vertically */
  flex-direction: column;  /* Ensures content is stacked vertically */
  padding: 0 2rem;  /* Added padding for spacing */
}

.logo {
  display: block;
  width: 150px;  /* Example width for the logo */
  height: auto;
  padding-bottom: 2rem;  /* Added padding for spacing between logo and nav */
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  padding-top: 2rem;  /* Replaced margin with padding for spacing */
  display: flex;
  justify-content: center;  /* Centers the links horizontally */
  gap: 1rem;  /* Space between the navigation links */
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  height: 2.5rem;
  display: flex;
  align-items: center;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: row;  /* Changed to row layout for larger screens */
    justify-content: space-between;  /* Places logo and nav at opposite ends */
    align-items: center;
    padding: 0 calc(var(--section-gap) / 2);  /* Added padding with calc */
  }

  .logo {
    width: 150px;  /* Adjusted logo width */
    height: auto;
    padding-right: 2rem;  /* Padding for spacing between logo and navigation */
  }

  header .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  nav {
    justify-content: flex-start;  /* Aligns links to the left */
    font-size: 1rem;
    padding: 1rem 0;
    gap: 2rem;  /* Increased space between links */
  }
}

</style>
