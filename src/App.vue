<template>
  <div id="app">
    <canvas id ="beerCanvas"></canvas>
    <div class="debbuger">
      <Navbar/>
      <router-view/>
    </div>
  </div>
</template>



<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar,
  },
  mounted() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', '../src/js/bulles.js')
    document.head.appendChild(recaptchaScript)
  },
}
</script>

<style>

</style>

<style>
/* @import '../src/css/all.css'; */

@import url('https://use.fontawesome.com/releases/v5.2.0/css/all.css');
@import '../src/css/bulles.css';
body::-webkit-scrollbar {
  display: none;
}
</style>

