<script setup lang="ts">
/**
 * ═══════════════════════════════════════════════════════════
 *  CyberInput.vue — Neon Glass Input Field
 * ═══════════════════════════════════════════════════════════
 *
 *  Styled input with glass background, floating label,
 *  neon focus border, error glow, and left icon slot.
 *  Fully v-model compatible via update:modelValue.
 */

import { computed, ref } from 'vue'

/* ── Types ─────────────────────────────────────────────────── */
type Variant = 'cyan' | 'purple'

interface Props {
  /** Bound value (v-model) */
  modelValue?: string | number
  /** HTML input type */
  type?: string
  /** Placeholder text */
  placeholder?: string
  /** Floating label text */
  label?: string
  /** Error message — shows red glow when present */
  error?: string
  /** Neon accent variant */
  variant?: Variant
  /** Disabled state */
  disabled?: boolean
  /** HTML id (auto-generated if omitted) */
  id?: string
  /** Autocomplete attribute */
  autocomplete?: string
  /** Required field */
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue:   '',
  type:         'text',
  placeholder:  '',
  label:        '',
  error:        '',
  variant:      'cyan',
  disabled:     false,
  id:           '',
  autocomplete: 'off',
  required:     false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

/* ── State ─────────────────────────────────────────────────── */
const isFocused = ref(false)
const inputRef  = ref<HTMLInputElement | null>(null)

/* ── Auto-id ───────────────────────────────────────────────── */
const inputId = computed(() =>
  props.id || `cyber-input-${Math.random().toString(36).slice(2, 9)}`,
)

/* ── Floating label active when focused or has value ───────── */
const isLabelFloating = computed(() =>
  isFocused.value || String(props.modelValue).length > 0,
)

/* ── Variant colours ───────────────────────────────────────── */
const variantColors: Record<Variant, {
  focusBorder: string
  focusRing: string
  labelColor: string
}> = {
  cyan: {
    focusBorder: 'border-[rgba(0,240,255,0.4)]',
    focusRing:   'ring-[rgba(0,240,255,0.1)]',
    labelColor:  'text-[#00f0ff]',
  },
  purple: {
    focusBorder: 'border-[rgba(168,85,247,0.4)]',
    focusRing:   'ring-[rgba(168,85,247,0.1)]',
    labelColor:  'text-[#a855f7]',
  },
}

/* ── Input wrapper classes ─────────────────────────────────── */
const wrapperClasses = computed(() => {
  const v = variantColors[props.variant]
  const classes = [
    'relative flex items-center',
    'w-full',
    'bg-white/[0.03]',
    'backdrop-blur-[8px]',
    'border rounded-xl',
    'transition-all duration-300 ease-out',
  ]

  if (props.error) {
    classes.push(
      'border-red-500/50',
      'ring-2 ring-red-500/10',
      'shadow-[0_0_16px_rgba(239,68,68,0.1)]',
    )
  } else if (isFocused.value) {
    classes.push(
      v.focusBorder,
      'ring-2',
      v.focusRing,
      `shadow-[0_0_20px_rgba(0,240,255,0.1)]`,
    )
  } else {
    classes.push('border-white/10')
  }

  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed')
  }

  return classes.join(' ')
})

/* ── Handlers ──────────────────────────────────────────────── */
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onFocus() {
  isFocused.value = true
}

function onBlur() {
  isFocused.value = false
}

function focusInput() {
  inputRef.value?.focus()
}
</script>

<template>
  <div class="w-full">
    <!-- Input wrapper -->
    <div
      :class="wrapperClasses"
      @click="focusInput"
    >
      <!-- Icon slot (left side) -->
      <div
        v-if="$slots.icon"
        class="flex shrink-0 items-center pl-3 text-white/30"
        aria-hidden="true"
      >
        <slot name="icon" />
      </div>

      <!-- Input + floating label container -->
      <div class="relative flex-1">
        <!-- Floating label -->
        <label
          v-if="label"
          :for="inputId"
          :class="[
            'pointer-events-none absolute left-3',
            'font-medium transition-all duration-200 ease-out',
            isLabelFloating
              ? ['-top-2.5 text-[10px]', error ? 'text-red-400' : variantColors[variant].labelColor]
              : 'top-1/2 -translate-y-1/2 text-sm text-white/30',
          ]"
        >
          {{ label }}
          <span v-if="required" class="text-red-400" aria-hidden="true">*</span>
        </label>

        <!-- Native input -->
        <input
          :id="inputId"
          ref="inputRef"
          :type="type"
          :value="modelValue"
          :placeholder="isLabelFloating ? placeholder : ''"
          :disabled="disabled"
          :autocomplete="autocomplete"
          :required="required"
          :aria-invalid="!!error || undefined"
          :aria-describedby="error ? `${inputId}-error` : undefined"
          class="w-full bg-transparent px-3 py-3 text-sm text-white/90 outline-none placeholder:text-white/20 disabled:cursor-not-allowed"
          :class="{ 'pt-5 pb-1': label }"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>

    <!-- Error message -->
    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="mt-1.5 flex items-center gap-1 text-xs text-red-400"
      role="alert"
    >
      <!-- Error icon -->
      <svg
        class="h-3.5 w-3.5 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
