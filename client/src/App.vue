<template>
    <HeaderSearch @search="onSearch" @toggle-dark-mode="toggleDarkMode" />
    <router-view />
</template>

<script>
import HeaderSearch from '@/components/HeaderSearch.vue';

export default {
  name: 'App',
  components: {
    HeaderSearch
    },
  methods: {
    onSearch(keyword) {
      if (!keyword || !keyword.trim()) return;
      this.$router?.push({ path: '/search', query: { q: keyword.trim() } });
    },
    toggleDarkMode(isDarkMode) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      localStorage.setItem('darkMode', isDarkMode);
    }
  },
  mounted() {
    // ページ読み込み時にダークモード状態を復元
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  }
};
</script>

<style>
#app {
  padding-top: 52px;
  box-sizing: border-box;
}
</style>
