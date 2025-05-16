<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Confirm Deletion</h2>
      <p class="text-gray-700">Are you sure you want to delete <strong>{{ employee.fullName }}</strong>?</p>
      <div class="flex justify-end mt-6 space-x-3">
        <button @click="$emit('cancel')" class="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded">Cancel</button>
        <button @click="$emit('confirm')" class="bg-red-600 text-white hover:bg-red-700 text-sm px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['employee']
};
</script>
