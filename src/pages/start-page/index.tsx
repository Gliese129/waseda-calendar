import { defineComponent, ref, computed, reactive, h, Transition } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import {
  VAlert,
  VBtn,
  VCard,
  VForm,
  VSelect,
  VTimeline,
  VTimelineItem,
} from 'vuetify/components'
import { useRouter } from 'vue-router'
import { languageOptions } from '@/assets/languages'

h('div') // This is a placeholder for the JSX function

export default defineComponent({
  name: 'StartPage',
  setup() {
    const store = useStore(key)
    const router = useRouter()

    const departments = computed(() =>
      store.state.syllabus.departments.map(
        (department: { name: string; value: string }) => ({
          title: department.name,
          value: department.value,
        })
      )
    )
    const languages = languageOptions.map((language) => ({
      title: language.name,
      value: language.value,
    }))

    const step = ref(0)

    const submit = () => {
      step.value++
      if (step.value >= components.value.length) {
        store.dispatch('user/setDepartment', info.department)
        store.dispatch('user/setFirstLogin', false)
        store.dispatch('user/setDisplayLanguage', info.displayLanguages)
        store.dispatch('user/setSearchLanguage', info.searchLanguages)
        router.push('/')
      }
    }

    const info = reactive({
      department: '',
      displayLanguages: 'ja_jp',
      searchLanguages: 'ja_jp',
    })

    const components = computed(() => [
      <div>
        <VSelect
          modelValue={info.department}
          onUpdate:modelValue={(val) => {
            info.department = val
          }}
          items={departments.value}
          label="Department"
        ></VSelect>
        <VSelect
          modelValue={info.displayLanguages}
          items={languages}
          label="Display Language"
        ></VSelect>
        <VSelect
          modelValue={info.searchLanguages}
          items={languages}
          label="Search Language"
        ></VSelect>
      </div>,
      <VAlert type="success">Congratulations! You have completed the setup.</VAlert>,
    ])

    return () => (
      <VCard
        class="mx-auto my-50 p-3"
        elevation="8"
        loading={departments.value.length === 0}
        width="80vw"
      >
        <VForm fast-fail class="flex flex-col">
          <VTimeline direction="horizontal" line-inset="2">
            {components.value.map((_, idx) => (
              <VTimelineItem
                key={idx}
                dot-color={idx === step.value ? 'blue' : 'white'}
                // @ts-ignore-next-line
                onClick={() => {
                  step.value = Math.min(idx, step.value)
                }}
              >
                {{
                  icon: () => <span>{idx + 1}</span>,
                }}
              </VTimelineItem>
            ))}
          </VTimeline>
          <Transition name="slide-fade" mode="out-in">
            {components.value[step.value]}
          </Transition>
          {/* @ts-ignore-next-line */}
          <VBtn onClick={submit} color="blue" block>
            next
          </VBtn>
        </VForm>
      </VCard>
    )
  },
})
