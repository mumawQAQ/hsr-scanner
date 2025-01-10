'use client';
import InstallRequirementModal from '@/app/components/modal/install-requirement-modal';
import SelectTemplateModal from '@/app/components/modal/select-template-modal';
import CreateTemplateModal from '@/app/components/modal/create-template-modal';
import { ExportTemplateModal } from '@/app/components/modal/export-template-modal';
import { ImportTemplateModal } from '@/app/components/modal/import-template-modal';
import { useEffect, useState } from 'react';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }


  return (
    <>
      <InstallRequirementModal />
      <SelectTemplateModal />
      <CreateTemplateModal />
      <ExportTemplateModal />
      <ImportTemplateModal />
    </>
  );
};
