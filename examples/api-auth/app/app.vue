<script setup lang="ts">
interface User {
  id: string
  email: string
  name: string
  role: string
  bio?: string
  joinedAt?: string
  lastLogin?: string
}

const email = ref('admin@example.com')
const password = ref('password')
const isLoggingIn = ref(false)

const { user, login, logout, fetchSession } = useApiAuth<User>()

const { data: profile, status: profileStatus, execute: fetchProfile } = useClientApiFetch<User>('/api/profile', {
  immediate: false
})

async function handleLogin() {
  isLoggingIn.value = true
  try {
    await login({
      email: email.value,
      password: password.value
    })
    await fetchProfile()
  } finally {
    isLoggingIn.value = false
  }
}

async function handleLogout() {
  await logout()
}

async function handleRefreshSession() {
  await fetchSession()
}

async function handleRefreshProfile() {
  await fetchProfile()
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <UCard v-if="!user">
          <template #header>
            <h2 class="text-xl font-semibold">
              Login
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField label="Email">
              <UInput
                v-model="email"
                icon="i-lucide-mail"
                type="email"
                placeholder="admin@example.com"
              />
            </UFormField>

            <UFormField label="Password">
              <UInput
                v-model="password"
                icon="i-lucide-lock"
                type="password"
                placeholder="password"
              />
            </UFormField>

            <UButton
              icon="i-lucide-log-in"
              :loading="isLoggingIn"
              block
              @click="handleLogin"
            >
              Login
            </UButton>
          </div>

          <template #footer>
            <UAlert
              color="primary"
              variant="subtle"
              icon="i-lucide-info"
              title="Demo Credentials"
              description="admin@example.com / password"
            />
          </template>
        </UCard>

        <template v-else>
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">
                  Session
                </h2>
                <UButton
                  icon="i-lucide-log-out"
                  color="error"
                  variant="outline"
                  @click="handleLogout"
                >
                  Logout
                </UButton>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <UAvatar
                  :alt="user.name"
                  size="xl"
                />
                <div>
                  <div class="text-lg font-semibold">
                    {{ user.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.email }}
                  </div>
                  <UBadge
                    :color="user.role === 'admin' ? 'primary' : 'neutral'"
                    variant="subtle"
                    class="mt-1"
                  >
                    {{ user.role }}
                  </UBadge>
                </div>
              </div>

              <UDivider />

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-500">
                    User ID
                  </div>
                  <div class="font-medium">
                    {{ user.id }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">
                    Role
                  </div>
                  <div class="font-medium">
                    {{ user.role }}
                  </div>
                </div>
              </div>

              <UButton
                icon="i-lucide-refresh-cw"
                variant="outline"
                block
                @click="handleRefreshSession"
              >
                Refresh Session
              </UButton>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">
                  Profile
                </h2>
                <UBadge
                  :color="profileStatus === 'pending' ? 'neutral' : profile ? 'success' : 'error'"
                  variant="subtle"
                >
                  {{ profileStatus }}
                </UBadge>
              </div>
            </template>

            <div class="space-y-4">
              <UButton
                icon="i-lucide-user"
                :loading="profileStatus === 'pending'"
                @click="handleRefreshProfile"
              >
                Fetch Profile
              </UButton>

              <UCard
                v-if="profile"
                :ui="{ body: { padding: 'p-4' } }"
              >
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Name</span>
                    <span class="font-medium">{{ profile.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Email</span>
                    <span class="font-medium">{{ profile.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Bio</span>
                    <span class="font-medium">{{ profile.bio }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Joined</span>
                    <span class="font-medium">{{ profile.joinedAt }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Last Login</span>
                    <span class="font-medium text-xs">{{ profile.lastLogin }}</span>
                  </div>
                </div>
              </UCard>
            </div>
          </UCard>
        </template>
      </div>
    </div>
  </UApp>
</template>
