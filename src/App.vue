
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Global Header -->
    <header class="sticky top-0 z-10 bg-white shadow p-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img src="./assets/logo.png" alt="Logo" class="w-8 h-8" />
        <h1 class="text-xl font-bold text-purple-700">Purple Cross – Employee Management</h1>
      </div>
      <div class="flex items-center gap-4">
        <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-medium">Logged in as Admin</span>
        <button @click="logout" class="text-sm text-purple-600 hover:underline">Logout</button>
      </div>
    </header>

    <!-- Route content -->
    <main class="flex-grow">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    logout() {
      alert('Logging out...');
      this.$router.push('/');
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
</style>
