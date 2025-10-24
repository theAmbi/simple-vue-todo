<template>
  <div class="font-sans max-w-md mx-auto p-6 bg-white shadow rounded">
    <div v-if="!user">
      <h2 class="text-xl font-bold mb-4">Sign In / Sign Up</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border p-2 w-full mb-2"
      />
      <button
        @click="signIn"
        class="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Sign In
      </button>
    </div>
    <div v-else>
      <p>Welcome, {{ user.email }}</p>
      <button
        @click="signOut"
        class="bg-red-500 text-white px-4 py-2 rounded mt-2"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

const email = ref("");
const user = ref(null);

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });
});

const signIn = async () => {
  const { error } = await supabase.auth.signInWithOtp({ email: email.value });
  if (error) alert(error.message);
  else alert("Check your email for the login link!");
};

const signOut = async () => {
  await supabase.auth.signOut();
};
</script>
