<template>
  <div class="home">
      <div class="classement">
        <Classement/>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Classement from '@/components/Home/Classement.vue'

export default {
  name: 'Home',
  components: {
    Classement
  }
}
</script>

<style>
.classement {
  margin: auto;
  align-self: center;
  width:fit-content
}
</style>