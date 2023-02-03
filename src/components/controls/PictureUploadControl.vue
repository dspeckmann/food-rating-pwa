<script setup lang="ts">
import { inject, Ref, ref } from 'vue'
import { Axios } from 'axios'
import { readFileAsDataUrl } from '../../utils'
import NewPicture from '../../domain/new-picture';

// Picture GUID as v-model
const props = defineProps<{ modelValue: string | undefined }>()
const emit = defineEmits(['update:modelValue'])
const isLoading = ref(false)
const dataUrl: Ref<string | undefined> = ref(undefined)

const axios = inject<Axios>('axios')
if (!axios) {
  throw new Error('Error while loading axios.')
}

async function fileChanged(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length === 1) {
    // TODO: Show image
    isLoading.value = true
    const file = files[0]
    dataUrl.value = await readFileAsDataUrl(file)
    const response = await axios!.post('/api/pictures', { fileName: file.name })
    const uploadDto = response.data as NewPicture

    // Temporarily store, delete and reset auth header because there seems to be a bug with Axios: https://github.com/axios/axios/issues/5416
    // TODO: Check if this is fixed by a more recent version.
    const auth = axios!.defaults.headers.common['Authorization']
    delete axios!.defaults.headers.common['Authorization']
    await axios!.put(uploadDto.presignedUploadUrl, file)
    // {
    //   transformRequest: (data, headers) => {
    //     delete headers.common!['Authorization']
    //     return data
    //   }
    // })
    axios!.defaults.headers.common['Authorization'] = auth
    emit('update:modelValue', uploadDto.id)
    isLoading.value = false
  }
}

async function deleteImage() {
  await axios!.delete(`/api/pictures/${props.modelValue}`)
  dataUrl.value = undefined
  emit('update:modelValue', undefined)
  // TODO: Delete image from storage as well?
}
</script>

<template>
  <div class="control" :class="{ 'is-loading': isLoading }">
    <input type="file" accept="image/*" class="input is-fullwidth" @change="fileChanged" v-if="!dataUrl" />
    <div class="uploaded-image-wrapper" v-else>
      <div class="uploaded-image-content" :style="{ 'background-image': `url(${dataUrl})` }" />
      <button class="button is-danger" :disabled="isLoading" @click="deleteImage">Löschen</button>
    </div>
  </div>
</template>

<style scoped>
.uploaded-image-wrapper {
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  gap: 1rem;
}
.uploaded-image-content {
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
