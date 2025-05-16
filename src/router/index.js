import { createRouter, createWebHistory } from 'vue-router';
import EmployeeGrid from '../components/EmployeeGrid.vue';
import EmployeeForm from '../components/EmployeeForm.vue';

const routes = [
  { path: '/', name: 'Home', component: EmployeeGrid },
  { path: '/view/:id', name: 'ViewEmployee', component: EmployeeForm, props: true },
  { path: '/edit/:id', name: 'EditEmployee', component: EmployeeForm, props: true },
  { path: '/create', name: 'CreateEmployee', component: EmployeeForm }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
