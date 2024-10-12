import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { useModal } from '@/app/hooks/use-modal-store';
import { useEffect, useState } from 'react';
import { checkUpdate, installUpdate, onUpdaterEvent, UpdateManifest } from '@tauri-apps/api/updater';
import { Button } from '@nextui-org/button';
import useBackendClientStore from '@/app/hooks/use-backend-client-store';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/tauri';

export const UpdaterModal = () => {
  const [manifest, setManifest] = useState<UpdateManifest | undefined>(undefined);
  const [onUpdate, setOnUpdate] = useState<boolean>(false);
  const {
    setLatestVersion,
  } = useBackendClientStore();

  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === 'updater';

  useEffect(() => {
    const updater = async () => {
      const unlisten = await onUpdaterEvent(({ error, status }) => {
        // This will log all updater events, including status updates and errors.
        console.log('Updater event', error, status);
      });

      try {
        const { manifest } = await checkUpdate();

        setManifest(manifest);
      } catch (error) {
        console.error(error);
      }

      unlisten();
    };


    updater();

  }, []);

  const handleUpdate = async () => {
    try {
      setOnUpdate(true);
      // backup the database
      await invoke<string>('pre_backup');
      await installUpdate();
    } catch (e) {
      toast.error(`更新时出现错误 ${e}`);
      setOnUpdate(false);
    }
  };


  return (
    <Modal isOpen={isModalOpen} size="md" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>发现新版本 {manifest?.version}</ModalHeader>
            <ModalBody>{manifest?.body}</ModalBody>
            <ModalFooter>
              <Button
                onPress={() => {
                  setLatestVersion(true);
                  onClose();
                }}
                isDisabled={onUpdate}
              >取消</Button>
              <Button color="primary" onPress={handleUpdate} isDisabled={onUpdate}>
                更新
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};