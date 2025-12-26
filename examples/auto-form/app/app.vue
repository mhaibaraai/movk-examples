<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { z } from 'zod/v4'

const toast = useToast()
const { afz } = useAutoForm()

const schema = afz.object({
  profile: afz.object({
    name: afz.string({
      controlProps: {}
    }).min(2).meta({ label: '姓名' }),
    email: afz.email().meta({ label: '邮箱' }),
    bio: afz.string().optional().meta({ label: '简介' })
  }).meta({ label: '个人资料' }),
  contact: afz.object({
    $layout: afz.layout({
      class: 'grid grid-cols-2 gap-4',
      fields: {
        phone: afz.string().optional().meta({ label: '电话' }),
        website: afz.url().optional().meta({ label: '网站' })
      }
    })
  }).meta({ label: '联系方式' }),
  notifications: afz.array(afz.string(), {
    type: 'checkboxGroup',
    controlProps: {
      items: [
        { label: '邮件', value: 'email' },
        { label: '短信', value: 'sms' },
        { label: '电话', value: 'phone' }
      ]
    }
  })
    .default(['email'])
    .meta({
      label: '复选框组',
      hint: '多选通知方式'
    }),
  fruits: afz.array(
    afz.object({
      name: afz.string().meta({ label: '商品名称' }),
      quantity: afz.number().int().default(1).meta({ label: '数量', hint: '默认为 1' }),
      price: afz.number().min(0).meta({ label: '价格' })
    }).meta({ label: '商品', hint: '请填写商品信息' })
  ).default([
    { name: '苹果', quantity: 2, price: 5.99 }
  ]).meta({ label: '商品列表' })
})

type Schema = z.output<typeof schema>

const form = ref<Partial<Schema>>({})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: '提交成功(event.data)',
    color: 'success',
    description: JSON.stringify(event.data, null, 2)
  })
  console.log('form.value:', form.value)
}
</script>

<template>
  <UApp>
    <div class="flex min-h-screen items-center justify-center p-4">
      <UCard class="w-full max-w-2xl">
        <MAutoForm
          :schema="schema"
          :state="form"
          :global-meta="{ collapsible: { defaultOpen: true } }"
          @submit="onSubmit"
        >
          <template #field-content:profile="{ path, value, setValue }">
            <UAlert
              color="primary"
              variant="subtle"
              icon="i-lucide-user"
              title="个人资料"
              description="完善您的个人信息"
            />

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="姓名" :name="`${path}.name`" required>
                <UInput
                  :model-value="value?.name"
                  placeholder="请输入您的姓名"
                  icon="i-lucide-user"
                  class="w-full"
                  @update:model-value="setValue('name', $event)"
                />
              </UFormField>
              <UFormField label="电子邮箱" :name="`${path}.email`" required>
                <UInput
                  :model-value="value?.email"
                  placeholder="请输入您的电子邮箱"
                  icon="i-lucide-mail"
                  type="email"
                  class="w-full"
                  @update:model-value="setValue('email', $event)"
                />
              </UFormField>
            </div>
            <UFormField label="简介" :name="`${path}.bio`" hint="可选">
              <UTextarea
                :model-value="value?.bio"
                placeholder="请输入您的个人简介"
                :rows="3"
                resize
                class="w-full"
                @update:model-value="setValue('bio', $event)"
              />
            </UFormField>
          </template>

          <template #field-before:contact="{ value, path }">
            <UAlert
              color="neutral"
              variant="subtle"
              icon="i-lucide-book-user"
              title="联系方式"
              description="提供您的联系信息，方便其他人与您交流"
            />

            <p class="text-gray-600 dark:text-gray-400 text-xs">
              {{ path }} 数据 :{{ value }}
            </p>
          </template>
        </MAutoForm>
      </UCard>
    </div>
  </UApp>
</template>
