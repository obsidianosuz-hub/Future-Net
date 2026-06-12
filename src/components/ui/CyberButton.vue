<script setup lang="ts">
/**
 * ═══════════════════════════════════════════════════════════
 *  CyberButton.vue — Neon Glass Button
 * ═══════════════════════════════════════════════════════════
 *
 *  Styled button with variant-based neon glow, pulse loading
 *  animation, glass background, and proper focus/a11y support.
 */

import { computed } from 'vue'

/* ── Types ─────────────────────────────────────────────────── */
type Variant = 'cyan' | 'purple' | 'emerald' | 'pink' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface Props {
  /** Neon colour variant */
  variant?: Variant
  /** Button size */
  size?: Size
  /** Show loading spinner + disable interaction */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant:  'cyan',
  size:     'md',
  loading:  false,
  disabled: false,
  type:     'button',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/* ── Variant styles ────────────────────────────────────────── */
const variantMap: Record<Variant, {
  base: string
  hover: string
  focusRing: string
  spinnerColor: string
}> = {
  cyan: {
    base:         'bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)] text-[#00f0ff]',
    hover:        'hover:bg-[rgba(0,240,255,0.18)] hover:shadow-neon-cyan hover:-translate-y-0.5',
    focusRing:    'focus-visible:ring-[#00f0ff]/40',
    spinnerColor: '#00f0ff',
  },
  purple: {
    base:         'bg-[rgba(168,85,247,0.1)] border-[rgba(168,85,247,0.3)] text-[#a855f7]',
    hover:        'hover:bg-[rgba(168,85,247,0.18)] hover:shadow-neon-purple hover:-translate-y-0.5',
    focusRing:    'focus-visible:ring-[#a855f7]/40',
    spinnerColor: '#a855f7',
  },
  emerald: {
    base:         'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-[#10b981]',
    hover:        'hover:bg-[rgba(16,185,129,0.18)] hover:shadow-neon-emerald hover:-translate-y-0.5',
    focusRing:    'focus-visible:ring-[#10b981]/40',
    spinnerColor: '#10b981',
  },
  pink: {
    base:         'bg-[rgba(244,114,182,0.1)] border-[rgba(244,114,182,0.3)] text-[#f472b6]',
    hover:        'hover:bg-[rgba(244,114,182,0.18)] hover:shadow-neon-pink hover:-translate-y-0.5',
    focusRing:    'focus-visible:ring-[#f472b6]/40',
    spinnerColor: '#f472b6',
  },
  ghost: {
    base:         'bg-transparent border-white/10 text-white/70',
    hover:        'hover:bg-white/5 hover:border-white/15 hover:text-white',
    focusRing:    'focus-visible:ring-white/20',
    spinnerColor: '#ffffff',
  },
}

/* ── Size styles ───────────────────────────────────────────── */
const sizeMap: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
}

/* ── Computed ──────────────────────────────────────────────── */
const isDisabled = computed(() => props.disabled || props.loading)

const buttonClasses = computed(() => {
  const v = variantMap[props.variant]
  const classes = [
    // Base structural
    'relative inline-flex items-center justify-center',
    'font-semibold border',
    'select-none cursor-pointer',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]',
    // Size
    sizeMap[props.size],
    // Variant
    v.base,
    v.focusRing,
  ]

  if (!isDisabled.value) {
    classes.push(v.hover)
  }

  if (isDisabled.value) {
    classes.push('opacity-40 cursor-not-allowed grayscale-[50%]')
  }

  if (props.loading) {
    classes.push('animate-glow-pulse')
  }

  return classes.join(' ')
})

const spinnerColor = computed(() => variantMap[props.variant].spinnerColor)

function handleClick(event: MouseEvent) {
  if (!isDisabled.value) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="isDisabled"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>

    <!-- Icon slot (left) -->
    <slot v-if="!loading" name="icon" />

    <!-- Default content -->
    <span :class="{ 'opacity-0': loading && !$slots.default }">
      <slot />
    </span>
  </button>
</template>
