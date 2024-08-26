<template>
    <NavHeader/>
  <router-view></router-view> 
</template>

<script>
import NavHeader from './components/NavHeader/NavHeader.vue';



export default {
  name: 'App',
  components : {
    NavHeader
  }
}
</script>

<style>

</style>
