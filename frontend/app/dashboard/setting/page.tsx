'use client';

import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/react';
import { open } from '@tauri-apps/api/shell';
import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { RefreshCcw } from 'lucide-react';
import { checkUpdate, installUpdate, UpdateManifest } from '@tauri-apps/api/updater';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/tauri';


export default function Setting() {
  const [version, setVersion] = useState<string | null>(null);
  const [manifest, setManifest] = useState<UpdateManifest | undefined>(undefined);
  const [onUpdate, setOnUpdate] = useState<boolean>(false);


  useEffect(() => {
    getVersion().then((version) => {
      setVersion(version);
    });
  }, []);


  const handleCheckUpdate = async () => {
    const update = await checkUpdate();
    if (update.shouldUpdate) {
      setManifest(update.manifest);
    } else {
      toast.success('当前已是最新版本');
    }
  };

  const handleUpdate = async () => {
    try {
      setOnUpdate(true);
      // kill the backend
      await invoke<string>('kill_backend');
      // backup the database
      await invoke<string>('pre_backup');
      await installUpdate();
    } catch (e) {
      toast.error(`更新时出现错误 ${e}`);
      setOnUpdate(false);
    }
  };


  return <div className="flex flex-col gap-4">
    <div className="text-center text-gray-600">
      HSR Scanner是一个开源的崩坏：星穹铁道遗器扫描工具，用来帮助玩家更好的清理遗器。
    </div>
    <div className="flex justify-center items-center gap-4">
      <Button
        size="sm"
        as={Link}
        onPress={async () => {
          await open('https://github.com/mumawQAQ/hsr-scanner');
        }}
        color="primary"
        showAnchorIcon
      >
        Github
      </Button>
      <Button
        size="sm"
        as={Link}
        color="primary"
        showAnchorIcon
      >
        提交Bug
      </Button>
      <Button
        size="sm"
        as={Link}
        color="primary"
        showAnchorIcon
      >
        提交功能建议
      </Button>
    </div>

    <div className="text-medium font-semibold">
      版本 & 更新
    </div>
    <Card className="py-5 px-2" shadow="sm" radius="sm">
      <CardBody className="flex flex-row gap-2 items-center">
        <RefreshCcw />
        <div className="grow">
          当前版本：{version ?? '未知'}
        </div>


        <Button size="md" variant="flat" onPress={handleCheckUpdate}>
          检查更新
        </Button>
      </CardBody>
    </Card>

    {
      manifest && <Card className="py-3 px-2" shadow="sm" radius="sm">
        <CardBody className="flex flex-row items-center">
          <div className="flex flex-col gap-2 grow">
            <div className="text-medium font-semibold">
              发现新版本 {manifest.version}
            </div>
            <div>
              {manifest.body}
            </div>
          </div>
          <Button size="md" variant="flat" color="success" onPress={handleUpdate} isDisabled={onUpdate}>
            {onUpdate ? '更新中...' : '更新'}
          </Button>
        </CardBody>
      </Card>
    }
  </div>;
}