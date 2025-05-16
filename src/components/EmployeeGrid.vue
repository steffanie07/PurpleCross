<template>
  <div class="space-y-6">
    <!-- Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 pt-6">
      <input
        v-model="filterText"
        type="text"
        placeholder="Search employees..."
        class="border px-4 py-2 rounded shadow-sm w-full sm:w-64 focus:ring-2 focus:ring-purple-400"
      />

      <div class="flex flex-wrap gap-2 items-center text-sm">
        <label>Rows per page:</label>
        <select v-model.number="pageSize" class="border rounded px-2 py-1">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>

        <button @click="exportToCSV" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Export CSV
        </button>

        <label class="cursor-pointer bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          <input type="file" accept=".csv" @change="importCSV" class="hidden" />
          Import CSV
        </label>

        <router-link to="/create" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Create
        </router-link>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto px-4">
      <table class="min-w-full text-sm bg-white border rounded shadow-sm whitespace-nowrap">
        <thead class="bg-purple-100 text-purple-900">
          <tr>
            <th class="px-3 py-2 text-left">Full Name</th>
            <th class="px-3 py-2 text-left">Occupation</th>
            <th class="px-3 py-2 text-left">Department</th>
            <th class="px-3 py-2 text-left">Employment Date</th>
            <th class="px-3 py-2 text-left">Termination Date</th>
            <th class="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in paginatedEmployees" :key="emp.id" class="border-t hover:bg-purple-50">
            <td class="px-3 py-2">{{ emp.fullName }}</td>
            <td class="px-3 py-2">{{ emp.occupation }}</td>
            <td class="px-3 py-2">{{ emp.department }}</td>
            <td class="px-3 py-2">
              {{ formatDate(emp.employmentDate) }}
              <div class="text-xs text-gray-500">{{ formatEmploymentStatus(emp.employmentDate) }}</div>
            </td>
            <td class="px-3 py-2">
              {{ formatDate(emp.terminationDate) }}
              <div class="text-xs text-gray-500">{{ formatTerminationStatus(emp.terminationDate) }}</div>
            </td>
            <td class="px-3 py-2 space-x-2">
              <router-link :to="'/view/' + emp.id" class="text-blue-600 hover:underline">View</router-link>
              <router-link :to="'/edit/' + emp.id" class="text-yellow-600 hover:underline">Edit</router-link>
              <button @click="confirmDelete(emp.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4 text-sm text-gray-700 px-4">
        <div>
          Showing {{ filteredEmployees.length === 0 ? 0 : start + 1 }} to {{ end }} of {{ filteredEmployees.length }} employees
        </div>
        <div class="space-x-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Prev
          </button>
          <button @click="nextPage" :disabled="end >= filteredEmployees.length" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';

export default {
  data() {
    return {
      employees: [],
      filterText: '',
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredEmployees() {
      const f = this.filterText.toLowerCase();
      return this.employees
        .filter(e =>
          (e.fullName || '').toLowerCase().includes(f) ||
          (e.occupation || '').toLowerCase().includes(f) ||
          (e.department || '').toLowerCase().includes(f)
        )
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredEmployees.slice(start, start + this.pageSize);
    },
    start() {
      return (this.currentPage - 1) * this.pageSize;
    },
    end() {
      return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
    }
  },
  watch: {
    filterText() {
      this.currentPage = 1;
    }
  },
  async mounted() {
    const stored = localStorage.getItem('employees');
    const rawData = stored ? JSON.parse(stored) : await (await fetch('/employees.json')).json();

    this.employees = rawData.map((e, i) => ({
      id: e.id || i + 1,
      ...e,
      employmentDate: e.employmentDate || e.dateOfEmployment
    }));

    localStorage.setItem('employees', JSON.stringify(this.employees));
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : '';
    },
    formatEmploymentStatus(date) {
      if (!date) return '';
      const d = new Date(date), now = new Date();
      return d > now ? 'employed soon' : 'currently employed';
    },
    formatTerminationStatus(date) {
      if (!date) return '';
      const d = new Date(date), now = new Date();
      return d > now ? 'to be terminated' : 'terminated';
    },
    confirmDelete(id) {
      this.employees = this.employees.filter(e => e.id !== id);
      localStorage.setItem('employees', JSON.stringify(this.employees));
    },
    exportToCSV() {
      const headers = ['Full Name', 'Occupation', 'Department', 'Employment Date', 'Termination Date'];
      const rows = this.filteredEmployees.map(e => [
        e.fullName, e.occupation, e.department, e.employmentDate, e.terminationDate
      ]);
      const csvContent = [headers, ...rows].map(r => r.map(f => `"${f || ''}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'employees.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    importCSV(event) {
      const file = event.target.files[0];
      if (!file) return;
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const imported = results.data.map((e, i) => ({
            id: Date.now() + i,
            fullName: e.fullName,
            occupation: e.occupation,
            department: e.department,
            employmentDate: e.employmentDate,
            terminationDate: e.terminationDate
          }));
          this.employees.push(...imported);
          localStorage.setItem('employees', JSON.stringify(this.employees));
        }
      });
    },
    nextPage() {
      if (this.end < this.filteredEmployees.length) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  }
};
</script>
