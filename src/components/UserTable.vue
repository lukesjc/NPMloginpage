<template>
    <table border="1" cellpadding="5">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>Avatar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.first_name }} {{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td><img :src="user.avatar" width="50" /></td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script lang="ts">
  import { defineComponent} from 'vue';
  import type { PropType } from 'vue';
  
  export default defineComponent({
    props: {
      users: {
        type: Array as PropType<any[]>,
        required: true,
      },
    },
  });
  </script>
  