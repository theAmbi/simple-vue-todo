<template>
  <div
    class="font-sans min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6"
  >
    <!-- App Title -->
    <h1 class="tracking-tighter text-4xl font-bold text-gray-900 mb-2">
      todo<span class="text-blue-600">.</span>
    </h1>
    <!-- Subtitle -->
    <p class="text-gray-500 mb-8 text-center">
      Sign in or create an account to manage your todos
    </p>

    <!-- Auth Form -->
    <div class="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <!-- Display error -->
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <!-- Sign In / Sign Up Button -->
      <button
        @click="signInOrSignUp"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
      >
        {{
          loading
            ? isSignUp
              ? "Signing up…"
              : "Signing in…"
            : isSignUp
            ? "Sign Up"
            : "Sign In"
        }}
      </button>

      <!-- Google Sign In -->
      <button
        @click="signInWithGoogle"
        :disabled="loading"
        class="w-full border border-gray-300 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
      >
        Continue with Google
      </button>

      <!-- Toggle Sign In / Sign Up -->
      <p class="text-center text-sm text-gray-600 mt-4">
        {{ isSignUp ? "Already have an account?" : "Don't have an account?" }}
        <button
          @click="isSignUp = !isSignUp"
          class="text-blue-600 hover:underline ml-1"
        >
          {{ isSignUp ? "Sign In" : "Sign Up" }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);
const isSignUp = ref(false);

// Redirect logged-in users immediately to dashboard
onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  if (data.user) router.push("/dashboard");
});

// Email/password sign in or sign up
const signInOrSignUp = async () => {
  loading.value = true;
  error.value = null;

  let response;
  if (isSignUp.value) {
    response = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (!response.error)
      alert("Signup successful! Check your email for confirmation.");
  } else {
    response = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (!response.error) router.push("/dashboard");
  }

  if (response.error) error.value = response.error.message;
  loading.value = false;
};

// Google OAuth sign-in
const signInWithGoogle = async () => {
  loading.value = true;
  const { error: googleError } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/dashboard` },
  });

  if (googleError) error.value = googleError.message;
  loading.value = false;
};
</script>
