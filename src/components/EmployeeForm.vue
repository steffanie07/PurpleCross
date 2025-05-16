<template>
  <div class="max-w-3xl mx-auto p-6 mt-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">
      {{ isViewMode ? 'Employee Details' : isEditMode ? 'Edit Employee' : 'Create New Employee' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block mb-1 font-medium">Full Name</label>
        <input
          v-model="form.fullName"
          :readonly="isViewMode"
          class="w-full border px-3 py-2 rounded"
          :class="{ 'border-red-500': errors.fullName }"
        />
        <p v-if="errors.fullName" class="text-sm text-red-600">{{ errors.fullName }}</p>
      </div>

      <div>
        <label class="block mb-1 font-medium">Occupation</label>
        <input
          v-model="form.occupation"
          :readonly="isViewMode"
          class="w-full border px-3 py-2 rounded"
          :class="{ 'border-red-500': errors.occupation }"
        />
        <p v-if="errors.occupation" class="text-sm text-red-600">{{ errors.occupation }}</p>
      </div>

      <div>
        <label class="block mb-1 font-medium">Department</label>
        <input
          v-model="form.department"
          :readonly="isViewMode"
          class="w-full border px-3 py-2 rounded"
          :class="{ 'border-red-500': errors.department }"
        />
        <p v-if="errors.department" class="text-sm text-red-600">{{ errors.department }}</p>
      </div>

      <div>
        <label class="block mb-1 font-medium">Employment Date</label>
        <input
          type="date"
          v-model="form.employmentDate"
          :readonly="isViewMode"
          class="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Termination Date</label>
        <input
          type="date"
          v-model="form.terminationDate"
          :readonly="isViewMode"
          class="w-full border px-3 py-2 rounded"
        />
      </div>
    </form>

    <div class="mt-6 flex justify-end space-x-3">
      <router-link to="/" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
        {{ isViewMode ? 'Back' : 'Cancel' }}
      </router-link>
      <button
        v-if="!isViewMode"
        @click="handleSubmit"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        fullName: '',
        occupation: '',
        department: '',
        employmentDate: '',
        terminationDate: ''
      },
      errors: {}
    };
  },
  computed: {
    isEditMode() {
      return this.$route.path.includes('/edit');
    },
    isViewMode() {
      return this.$route.path.includes('/view');
    }
  },
 mounted() {
  const id = parseInt(this.$route.params.id);
  const employees = JSON.parse(localStorage.getItem('employees') || '[]');

  const emp = employees.find(e => e.id === id);
  if (emp) {
    this.form = { ...emp };
  }
}
,
  methods: {
    validateForm() {
      const errors = {};
      if (!this.form.fullName) errors.fullName = 'Full name is required';
      if (!this.form.occupation) errors.occupation = 'Occupation is required';
      if (!this.form.department) errors.department = 'Department is required';
      return errors;
    },
    handleSubmit() {
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length > 0) return;

      const stored = localStorage.getItem('employees');
      let employees = stored ? JSON.parse(stored) : [];

      if (this.isEditMode) {
        const index = employees.findIndex(e => e.id === this.form.id);
        if (index !== -1) {
          employees[index] = this.form;
        }
      } else {
        this.form.id = Date.now();
        employees.push(this.form);
      }

      localStorage.setItem('employees', JSON.stringify(employees));
      this.$router.push('/');
    }
  }
};
</script>
