'use client';

import React from 'react';
import RelicTemplateCard from '@/app/components/relic-template-card';
import RelicTemplateCreateCard from '@/app/components/relic-template-create-card';
import { RelicTemplate } from '@/app/types/relic-template-types';
import { useRelicTemplateList } from '@/app/apis/relic-template';
import { Spinner } from '@nextui-org/react';

export default function RelicTemplates() {
  const { data: relicTemplates, error, isLoading } = useRelicTemplateList();

  if (isLoading) {
    return (
      <div className="mt-40 flex items-center justify-center">
        <Spinner size="lg" label="加载中..." />
      </div>
    );
  }

  if (error) {
    return <div className="mt-40 text-center">加载失败，{error.message}</div>;
  }

  return (
    <div className="flex flex-wrap gap-5">
      {relicTemplates?.map((template: RelicTemplate) => <RelicTemplateCard template={template} key={template.id} />)}
      <RelicTemplateCreateCard />
    </div>
  );
}
