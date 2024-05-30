<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { watch } from 'vue'
import { onMounted } from 'vue'
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: '',
    },
    action: {
        type: Function,
        default: undefined,
    },
    link: {
        type: String,
        default: undefined,
    },
    modelValue: {
        type: Object,
        default: undefined,
    },
})
const router = useRouter()

const clickedAction = async () => {
    if (props.action) {
        loading.value = true
        await props.action()
        loading.value = false
    }
    if (props.link) {
        router.push(props.link)
    }
    if (props.modelValue?.value !== undefined) {
        // since modelValue is computed ref, we can directly change the value
        // eslint-disable-next-line vue/no-mutating-props
        props.modelValue.value = !props.modelValue.value
    }
}
const loading = ref(false)

const checkboxValue = ref(false)
watch(
    props,
    (newVal) => {
        checkboxValue.value = newVal.modelValue?.value
    },
    {
        deep: true,
        immediate: true,
    }
)
onMounted(() => {
    checkboxValue.value = props.modelValue?.value
})
</script>

<template>
  <v-list-item
    :prepend-icon="props.icon"
    :title="props.title"
    :subtitle="props.description"
    class="text-left"
    @click.prevent="clickedAction"
  >
    <template #prepend>
      <v-progress-circular
        v-if="loading"
        color="grey"
        indeterminate
        class="mr-6"
      ></v-progress-circular>
      <v-icon v-else :icon="props.icon"></v-icon>
    </template>
    <template v-if="props.modelValue?.value !== undefined" #append>
      <v-checkbox v-model="checkboxValue" color="primary" readonly></v-checkbox>
    </template>
  </v-list-item>
</template>

<style scoped></style>
