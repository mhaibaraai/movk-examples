<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  role: string
  status?: string
}

const toast = useToast()
const selectedUserId = ref<number>(1)
const newUserName = ref('')
const newUserEmail = ref('')
const isCreating = ref(false)

const { data: users, status: usersStatus, refresh: refreshUsers } = await useApiFetch<User[]>('/api/users', {
  immediate: true
})

const { data: userDetail, status: userDetailStatus, execute: fetchUserDetail } = useClientApiFetch<User>(() => `/api/users/${selectedUserId.value}`, {
  immediate: false
})

async function handleFetchUser() {
  await fetchUserDetail()
}

async function handleCreateUser() {
  if (!newUserName.value || !newUserEmail.value) {
    toast.add({
      title: 'Validation Error',
      description: 'Name and email are required',
      color: 'error'
    })
    return
  }

  isCreating.value = true
  try {
    const { data } = await useClientApiFetch<User>('/api/users', {
      method: 'POST',
      body: {
        name: newUserName.value,
        email: newUserEmail.value,
        role: 'user'
      }
    })

    if (data.value) {
      toast.add({
        title: 'Created',
        color: 'success'
      })
      newUserName.value = ''
      newUserEmail.value = ''
      await refreshUsers()
    }
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-6xl mx-auto space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                Users List
              </h2>
              <UBadge
                :color="usersStatus === 'pending' ? 'neutral' : 'success'"
                variant="subtle"
              >
                {{ usersStatus }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <UButton
              icon="i-lucide-refresh-cw"
              :loading="usersStatus === 'pending'"
              @click="refreshUsers"
            >
              Refresh
            </UButton>

            <div
              v-if="users"
              class="grid gap-3"
            >
              <UCard
                v-for="user in users"
                :key="user.id"
                :ui="{ body: { padding: 'p-3' } }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UAvatar
                      :alt="user.name"
                      size="md"
                    />
                    <div>
                      <div class="font-medium">
                        {{ user.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                  <UBadge
                    :color="user.role === 'admin' ? 'primary' : 'neutral'"
                    variant="subtle"
                  >
                    {{ user.role }}
                  </UBadge>
                </div>
              </UCard>
            </div>
          </div>
        </UCard>

        <div class="grid md:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">
                Fetch User Detail
              </h2>
            </template>

            <div class="space-y-4">
              <UFormField label="User ID">
                <USelectMenu
                  v-model="selectedUserId"
                  :options="users?.map(u => ({ label: u.name, value: u.id })) || []"
                  value-key="value"
                />
              </UFormField>

              <UButton
                icon="i-lucide-search"
                :loading="userDetailStatus === 'pending'"
                block
                @click="handleFetchUser"
              >
                Fetch
              </UButton>

              <UCard
                v-if="userDetail"
                :ui="{ body: { padding: 'p-4' } }"
              >
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-500">ID</span>
                    <span class="font-medium">{{ userDetail.id }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Name</span>
                    <span class="font-medium">{{ userDetail.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Email</span>
                    <span class="font-medium">{{ userDetail.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Role</span>
                    <UBadge
                      :color="userDetail.role === 'admin' ? 'primary' : 'neutral'"
                      variant="subtle"
                    >
                      {{ userDetail.role }}
                    </UBadge>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Status</span>
                    <UBadge
                      :color="userDetail.status === 'active' ? 'success' : 'neutral'"
                      variant="subtle"
                    >
                      {{ userDetail.status }}
                    </UBadge>
                  </div>
                </div>
              </UCard>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">
                Create User
              </h2>
            </template>

            <div class="space-y-4">
              <UFormField label="Name">
                <UInput
                  v-model="newUserName"
                  icon="i-lucide-user"
                  placeholder="Enter name"
                />
              </UFormField>

              <UFormField label="Email">
                <UInput
                  v-model="newUserEmail"
                  icon="i-lucide-mail"
                  type="email"
                  placeholder="Enter email"
                />
              </UFormField>

              <UButton
                icon="i-lucide-plus"
                :loading="isCreating"
                block
                @click="handleCreateUser"
              >
                Create
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </UApp>
</template>
