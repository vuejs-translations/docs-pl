<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Vue Partners' }}</template>
    <template #lead>
      <p>
        Partnerzy Vue to zatwierdzone przez zespół Vue agencje, które świadczą najwyższej klasy
        usługi konsultingowe i programistyczne Vue. Jeśli Twoja firma jest
        zainteresowana dołączeniem do grona partnerów, prosimy
        <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank"
          >zarejestruj swoje zainteresowanie tutaj</a
        >.
      </p>
    </template>
  </PageHero>
</template>
