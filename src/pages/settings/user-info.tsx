import { key } from '@/store'
import { computed, defineComponent, h, watch } from 'vue'
import { VCard, VCardItem, VCardTitle, VCol, VRow, VSelect } from 'vuetify/components'
import { useStore } from 'vuex'
import { useLocale } from 'vuetify'
import { languageOptions } from '@/resources/languages'
import { useRouter } from 'vue-router'

h('div') // This is a placeholder for the JSX function

const displayLanguageOptions = languageOptions.map((language) => ({
  title: language.name,
  value: language.value,
}))
const searchLanguageOptions = languageOptions
  .map((language) => ({
    title: language.name,
    value: language.value,
  }))
  .filter((language) => ['ja', 'en'].includes(language.value))

export default defineComponent({
  name: 'UserInfo',
  setup() {
    const store = useStore(key)
    const { t } = useLocale()
    const router = useRouter()

    const userDepartment = computed({
      get: () => store.state.user.department,
      set: (value: string) => store.commit('user/setDepartment', value),
    })
    const displayLanguage = computed({
      get: () => store.state.user.displayLanguage,
      set: (value: string) => store.commit('user/setDisplayLanguage', value),
    })
    const searchLanguage = computed({
      get: () => store.state.user.searchLanguage,
      set: (value: string) => store.commit('user/setSearchLanguage', value),
    })
    const departments = computed(() =>
      store.state.syllabus.departments.map((item) => ({
        title: item.name,
        value: item.value,
      }))
    )
    watch(displayLanguage, (value) => {
      router.push({ name: 'settings', params: { lang: value } })
      setTimeout(() => {
        router.go(0)
      }, 100)
    })

    return () => (
      <VCard class="mx-2">
        <VCardTitle>User</VCardTitle>
        <VCardItem>
          <VSelect
            modelValue={userDepartment}
            items={departments.value}
            label={t('form.department')}
            density="compact"
            prependIcon="mdi-domain"
          ></VSelect>
          <VRow>
            <VCol cols={6}>
              <VSelect
                modelValue={displayLanguage}
                items={displayLanguageOptions}
                label={t('form.displayLanguage')}
                density="compact"
                prependIcon="mdi-translate"
              ></VSelect>
            </VCol>
            <VCol cols={6}>
              <VSelect
                modelValue={searchLanguage}
                items={searchLanguageOptions}
                label={t('form.searchLanguage')}
                density="compact"
                prependIcon="mdi-cloud-search-outline"
              ></VSelect>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    )
  },
})
