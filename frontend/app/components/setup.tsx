'use client';
import { useEffect } from 'react';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import { useJsonFile } from '@/app/apis/files';
import { useRelicTemplateList } from '@/app/apis/relic-template';

export const Setup = () => {
  const { apiInitialized } = useBackendClientStore();
  const relicSets = useJsonFile('relic/relic_sets.json');
  const characters = useJsonFile('character/character_meta.json');
  const relicTemplateList = useRelicTemplateList();
  const backendClient = useBackendClientStore();

  useEffect(() => {
    if (apiInitialized) {
      // refresh relic sets and characters
      relicSets.refetch();
      characters.refetch();
      relicTemplateList.refetch();

      // init the used template
      backendClient.api?.get('/rating-template/init');

    }
  }, [apiInitialized]);


  return null;
};