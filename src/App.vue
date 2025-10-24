<!-- <template>
  <div class="min-h-screen bg-gray-100 p-6">
    <Auth />
    <Todos v-if="user" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Auth from "./components/Auth.vue";
import Todos from "./components/Todos.vue";
import { supabase } from "./supabase";

const user = ref(null);

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });
});
</script> -->

<template>
  <div>
    <!-- Global Header -->
    <header
      v-if="showHeader"
      class="flex justify-between items-center p-4 bg-white shadow-md"
    >
      <h1 class="text-xl font-bold">Todo App</h1>

      <div class="flex items-center space-x-3" v-if="user">
        <span>{{ user.email }}</span>
        <button
          @click="signOut"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </header>

    <!-- Page Content -->
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "./supabase";

const router = useRouter();
const route = useRoute();
const user = ref(null);

// Hide header on auth page
const showHeader = computed(() => route.path !== "/auth");

// Fetch current user
onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;

  // Listen to auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
    if (!user.value && route.path !== "/auth") router.push("/auth");
  });
});

// Sign out
const signOut = async () => {
  await supabase.auth.signOut();
  router.push("/auth");
};
</script>
