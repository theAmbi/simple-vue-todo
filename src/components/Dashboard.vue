<template>
  <div class="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
    <!-- Welcome + Add Todo Button -->
    <div class="flex flex-col items-center space-y-4 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 text-center">
        Welcome, {{ user?.user_metadata?.first_name || user?.email }}
      </h1>

      <button
        @click="showForm = !showForm"
        class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Add Todo
      </button>
    </div>

    <!-- Inline Add Todo Form -->
    <div
      v-if="showForm"
      class="w-full max-w-md bg-white p-6 rounded-2xl shadow mb-6"
    >
      <h2 class="text-xl font-bold mb-4">Add New Todo</h2>

      <input
        v-model="newTitle"
        placeholder="Title"
        class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        v-model="newDescription"
        placeholder="Description"
        class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <input
        v-model="newDate"
        type="date"
        class="w-full mb-2 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="newTime"
        type="time"
        class="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      <div class="flex justify-end space-x-2 mt-4">
        <button
          @click="clearForm"
          class="px-3 py-1 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          @click="addTodo"
          class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>

    <!-- Todos List -->
    <section class="w-full max-w-3xl">
      <div v-if="todos.length === 0" class="text-center text-gray-500 mt-8">
        <p>No todos yet.</p>
        <p class="mt-2">
          Use the "Add Todo" form above to create your first task!
        </p>
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="bg-white p-4 rounded shadow flex justify-between items-start"
        >
          <div>
            <h3 class="font-semibold text-gray-900">{{ todo.title }}</h3>
            <p class="text-gray-700">{{ todo.description }}</p>
            <p class="text-sm text-gray-500 mt-1">
              {{ todo.date }} at {{ todo.time }}
            </p>
          </div>
          <!-- Delete Icon -->
          <LucideTrash
            @click="deleteTodo(todo.id)"
            class="w-5 h-5 text-red-500 cursor-pointer"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";
import { Trash as LucideTrash } from "lucide-vue-next";

const router = useRouter();
const user = ref(null);
const todos = ref([]);

const showForm = ref(false);

const newTitle = ref("");
const newDescription = ref("");
const newDate = ref("");
const newTime = ref("");

// Fetch user and their todos
onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    router.push("/auth");
  } else {
    user.value = data.user;
    fetchTodos();
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
    if (!user.value) router.push("/auth");
  });
});

// Fetch todos from Supabase
const fetchTodos = async () => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.value.id)
    .order("id", { ascending: false });

  if (error) console.error(error);
  else todos.value = data;
};

// Add new todo to Supabase
const addTodo = async () => {
  if (!newTitle.value) return alert("Title is required!");
  const { data, error } = await supabase.from("todos").insert([
    {
      user_id: user.value.id,
      title: newTitle.value,
      description: newDescription.value,
      date: newDate.value,
      time: newTime.value,
    },
  ]);

  if (error) alert(error.message);
  else todos.value.unshift(data[0]);

  clearForm();
};

// Clear form
const clearForm = () => {
  newTitle.value = "";
  newDescription.value = "";
  newDate.value = "";
  newTime.value = "";
  showForm.value = false;
};

// Delete todo from Supabase
const deleteTodo = async (id) => {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) alert(error.message);
  else todos.value = todos.value.filter((t) => t.id !== id);
};
</script>
