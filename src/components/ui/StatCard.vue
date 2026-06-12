<script setup lang="ts">
/**
 * ═══════════════════════════════════════════════════════════
 *  StatCard.vue — Dashboard Statistics Card
 * ═══════════════════════════════════════════════════════════
 *
 *  Displays a KPI metric inside a GlassCard with:
 *    • Large value display
 *    • Trend arrow (up ▲ green / down ▼ red)
 *    • Neon accent based on variant
 *    • Icon slot for contextual visuals
 *
 *  Uses GlassCard internally for consistent glass styling.
 */

import { computed } from 'vue'
import GlassCard from './GlassCard.vue'

/* ── Types ─────────────────────────────────────────────────── */
type Variant = 'cyan' | 'purple' | 'emerald'

interface Props {
  /** Metric title / label */
  title: string
  /** The primary display value */
  value: string | number
  /** Percentage change (positive = up, negative = down) */
  change?: number
  /** Descriptive label for the change (e.g. "vs last week") */
  changeLabel?: string
  /** Neon accent variant */
  variant?: Variant
}

const props = withDefaults(defineProps<Props>(), {
  change:      0,
  changeLabel: '',
  variant:     'cyan',
})

/* ── Trend computation ─────────────────────────────────────── */
const isPositive = computed(() => props.change >= 0)

const trendColor = computed(() =>
  isPositive.value ? 'text-emerald-400' : 'text-red-400',
)

const trendIcon = computed(() =>
  isPositive.value ? '▲' : '▼',
)

const formattedChange = computed(() => {
  const abs = Math.abs(props.change)
  return `${abs.toFixed(1)}%`
})

/* ── Accent text colour by variant ─────────────────────────── */
const accentColor: Record<Variant, string> = {
  cyan:    'text-[#00f0ff]',
  purple:  'text-[#a855f7]',
  emerald: 'text-[#10b981]',
}

const valueClasses = computed(() => [
  'text-3xl font-bold tracking-tight',
  accentColor[props.variant],
])

/* ── Icon background tint by variant ───────────────────────── */
const iconBg: Record<Variant, string> = {
  cyan:    'bg-[rgba(0,240,255,0.1)]',
  purple:  'bg-[rgba(168,85,247,0.1)]',
  emerald: 'bg-[rgba(16,185,129,0.1)]',
}

const iconWrapperClasses = computed(() => [
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
  iconBg[props.variant],
])
</script>

<template>
  <GlassCard
    :variant="variant"
    blur="md"
    padding="md"
    rounded="xl"
    :hover="true"
    :neon-border="false"
    :animated="true"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- Text content -->
      <div class="min-w-0 flex-1">
        <!-- Title -->
        <p class="mb-1 truncate text-sm font-medium text-white/50">
          {{ title }}
        </p>

        <!-- Value -->
        <p :class="valueClasses" :aria-label="`${title}: ${value}`">
          {{ value }}
        </p>

        <!-- Trend row -->
        <div
          v-if="change !== 0 || changeLabel"
          class="mt-2 flex items-center gap-1.5 text-xs"
        >
          <!-- Trend arrow + percentage -->
          <span
            v-if="change !== 0"
            :class="['inline-flex items-center gap-0.5 font-semibold', trendColor]"
            :aria-label="`${isPositive ? 'Increased' : 'Decreased'} by ${formattedChange}`"
          >
            <span class="text-[10px]" aria-hidden="true">{{ trendIcon }}</span>
            {{ formattedChange }}
          </span>

          <!-- Change label -->
          <span v-if="changeLabel" class="text-white/30">
            {{ changeLabel }}
          </span>
        </div>
      </div>

      <!-- Icon slot -->
      <div
        v-if="$slots.icon"
        :class="iconWrapperClasses"
        aria-hidden="true"
      >
        <slot name="icon" />
      </div>
    </div>
  </GlassCard>
</template>
