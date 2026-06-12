<script setup lang="ts">
/**
 * ═══════════════════════════════════════════════════════════
 *  NeonBadge.vue — Glowing Pill Badge / Tag
 * ═══════════════════════════════════════════════════════════
 *
 *  Compact badge with neon glow, optional pulse animation,
 *  and six colour variants.  Perfect for statuses, labels,
 *  tags, and category markers.
 */

import { computed } from 'vue'

/* ── Types ─────────────────────────────────────────────────── */
type Variant = 'cyan' | 'purple' | 'emerald' | 'pink' | 'yellow' | 'red'
type Size    = 'sm' | 'md'

interface Props {
  /** Neon colour variant */
  variant?: Variant
  /** Badge size */
  size?: Size
  /** Enable soft pulse animation */
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'cyan',
  size:    'md',
  pulse:   false,
})

/* ── Variant style map ─────────────────────────────────────── */
const variantMap: Record<Variant, {
  bg: string
  text: string
  border: string
  dot: string
  shadow: string
}> = {
  cyan: {
    bg:     'bg-[rgba(0,240,255,0.08)]',
    text:   'text-[#00f0ff]',
    border: 'border-[rgba(0,240,255,0.2)]',
    dot:    'bg-[#00f0ff]',
    shadow: 'shadow-[0_0_8px_rgba(0,240,255,0.25)]',
  },
  purple: {
    bg:     'bg-[rgba(168,85,247,0.08)]',
    text:   'text-[#a855f7]',
    border: 'border-[rgba(168,85,247,0.2)]',
    dot:    'bg-[#a855f7]',
    shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.25)]',
  },
  emerald: {
    bg:     'bg-[rgba(16,185,129,0.08)]',
    text:   'text-[#10b981]',
    border: 'border-[rgba(16,185,129,0.2)]',
    dot:    'bg-[#10b981]',
    shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.25)]',
  },
  pink: {
    bg:     'bg-[rgba(244,114,182,0.08)]',
    text:   'text-[#f472b6]',
    border: 'border-[rgba(244,114,182,0.2)]',
    dot:    'bg-[#f472b6]',
    shadow: 'shadow-[0_0_8px_rgba(244,114,182,0.25)]',
  },
  yellow: {
    bg:     'bg-[rgba(250,204,21,0.08)]',
    text:   'text-[#facc15]',
    border: 'border-[rgba(250,204,21,0.2)]',
    dot:    'bg-[#facc15]',
    shadow: 'shadow-[0_0_8px_rgba(250,204,21,0.25)]',
  },
  red: {
    bg:     'bg-[rgba(239,68,68,0.08)]',
    text:   'text-[#ef4444]',
    border: 'border-[rgba(239,68,68,0.2)]',
    dot:    'bg-[#ef4444]',
    shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.25)]',
  },
}

/* ── Size map ──────────────────────────────────────────────── */
const sizeMap: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
}

/* ── Computed ──────────────────────────────────────────────── */
const badgeClasses = computed(() => {
  const v = variantMap[props.variant]
  return [
    'inline-flex items-center gap-1.5',
    'rounded-full border font-semibold',
    'backdrop-blur-[4px]',
    'transition-all duration-300',
    sizeMap[props.size],
    v.bg,
    v.text,
    v.border,
    v.shadow,
  ].join(' ')
})

const dotClasses = computed(() => {
  const v = variantMap[props.variant]
  return [
    'h-1.5 w-1.5 rounded-full',
    v.dot,
    props.pulse ? 'animate-glow-pulse' : '',
  ].filter(Boolean).join(' ')
})
</script>

<template>
  <span
    :class="badgeClasses"
    role="status"
  >
    <!-- Pulse dot indicator -->
    <span
      v-if="pulse"
      :class="dotClasses"
      aria-hidden="true"
    />

    <!-- Badge content -->
    <slot />
  </span>
</template>
