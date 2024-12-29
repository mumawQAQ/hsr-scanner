'use client';
import InstallRequirementModal from '@/app/components/modal/install-requirement-modal';
import SelectTemplateModal from '@/app/components/modal/select-template-modal';
import CreateTemplateModal from '@/app/components/modal/create-template-modal';
import { ExportTemplateModal } from '@/app/components/modal/export-template-modal';
import { ImportTemplateModal } from '@/app/components/modal/import-template-modal';
import { StartAutoScanModal } from '@/app/components/modal/start-auto-scan-modal';

export const ModalProvider = () => {
  return (
    <>
      <InstallRequirementModal />
      <SelectTemplateModal />
      <CreateTemplateModal />
      <ExportTemplateModal />
      <ImportTemplateModal />
      <StartAutoScanModal />
    </>
  );
};
