<template>
  <div 
    :class="[
      'rounded-2xl transition-all duration-300 relative overflow-hidden',
      cardClass,
      hoverClass,
      shadowClass
    ]"
  >
    <!-- Background grid subtle texture inside the card -->
    <div v-if="gridTexture" class="absolute inset-0 cyber-grid-overlay opacity-20 pointer-events-none" />

    <!-- Neon ambient glow dot behind card -->
    <div 
      v-if="neonGlow" 
      :class="[
        'absolute -top-12 -left-12 w-24 h-24 rounded-full filter blur-xl opacity-30 pointer-events-none',
        glowDotClass
      ]"
    />

    <!-- Holographic reflection stripe -->
    <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

    <!-- Content Slot -->
    <div class="relative z-10 p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'cyan' | 'purple' | 'emerald' | 'pink'
  blur?: 'sm' | 'md' | 'lg'
  hover?: boolean
  neonBorder?: boolean
  neonGlow?: boolean
  gridTexture?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  blur: 'md',
  hover: true,
  neonBorder: true,
  neonGlow: true,
  gridTexture: true
})

// Glassmorphism classes mapping based on variant and blur level
const cardClass = computed(() => {
  const classes = []
  
  // Blur intensity
  if (props.blur === 'sm') {
    classes.push('backdrop-blur-[6px]')
  } else if (props.blur === 'md') {
    classes.push('backdrop-blur-[12px]')
  } else {
    classes.push('backdrop-blur-[20px]')
  }

  // Border & background based on neonBorder & variant
  switch (props.variant) {
    case 'cyan':
      classes.push(
        'bg-cyan-950/45',
        props.neonBorder ? 'border border-cyber-cyan/35' : 'border border-white/10'
      )
      break
    case 'purple':
      classes.push(
        'bg-purple-950/45',
        props.neonBorder ? 'border border-cyber-purple/35' : 'border border-white/10'
      )
      break
    case 'emerald':
      classes.push(
        'bg-emerald-950/45',
        props.neonBorder ? 'border border-cyber-emerald/35' : 'border border-white/10'
      )
      break
    case 'pink':
      classes.push(
        'bg-pink-950/45',
        props.neonBorder ? 'border border-cyber-pink/35' : 'border border-white/10'
      )
      break
    case 'default':
    default:
      classes.push(
        'bg-white/[0.04]',
        props.neonBorder ? 'border border-white/10' : 'border border-white/5'
      )
  }

  return classes.join(' ')
})

// Interactive micro-animations
const hoverClass = computed(() => {
  if (!props.hover) return ''
  
  switch (props.variant) {
    case 'cyan':
      return 'hover:border-cyber-cyan/70 hover:shadow-neon-cyan hover:scale-[1.01] cursor-pointer'
    case 'purple':
      return 'hover:border-cyber-purple/70 hover:shadow-neon-purple hover:scale-[1.01] cursor-pointer'
    case 'emerald':
      return 'hover:border-cyber-emerald/70 hover:shadow-neon-emerald hover:scale-[1.01] cursor-pointer'
    case 'pink':
      return 'hover:border-cyber-pink/70 hover:shadow-neon-pink hover:scale-[1.01] cursor-pointer'
    case 'default':
    default:
      return 'hover:border-white/20 hover:shadow-glass hover:scale-[1.01] cursor-pointer'
  }
})

// Ambient glow shadows
const shadowClass = computed(() => {
  switch (props.variant) {
    case 'cyan':
      return 'shadow-neon-cyan/20'
    case 'purple':
      return 'shadow-neon-purple/20'
    case 'emerald':
      return 'shadow-neon-emerald/20'
    case 'pink':
      return 'shadow-neon-pink/20'
    case 'default':
    default:
      return 'shadow-glass'
  }
})

// Ambient spot classes
const glowDotClass = computed(() => {
  switch (props.variant) {
    case 'cyan':
      return 'bg-cyber-cyan'
    case 'purple':
      return 'bg-cyber-purple'
    case 'emerald':
      return 'bg-cyber-emerald'
    case 'pink':
      return 'bg-cyber-pink'
    case 'default':
    default:
      return 'bg-white'
  }
})
</script>

<style scoped>
/* Scoped adjustments if any */
</style>
