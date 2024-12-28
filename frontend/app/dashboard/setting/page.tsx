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
import { AssertUpdateCheckResponse, RelicBoxPositionType } from '@/app/types/api-types';
import { Switch } from '@nextui-org/switch';
import { useConfig } from '@/app/hooks/use-config-hook';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import { useMousePosition } from '@/app/apis/state';
import BoxSetting from '@/app/components/box-setting';


export default function Setting() {
  const [version, setVersion] = useState<string | null>(null);
  const [manifest, setManifest] = useState<UpdateManifest | undefined>(undefined);
  const [onCheckAppUpdate, setOnCheckAppUpdate] = useState<boolean>(false);
  const [onAppDownload, setOnAppDownload] = useState<boolean>(false);

  const [onAssertUpdate, setOnAssertUpdate] = useState<boolean>(false);
  const [filesToUpdate, setFilesToUpdate] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const appConfig = useConfig();
  const mousePosition = useMousePosition();


  useEffect(() => {
    getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

  const handleCheckAppUpdate = async () => {
    setOnCheckAppUpdate(true);
    try {
      const update = await checkUpdate();
      if (update.shouldUpdate) {
        setManifest(update.manifest);
      } else {
        toast.success('当前已是最新版本');
      }
    } catch (e) {
      toast.error(`检查更新时出现错误 ${e}`);
    }
    setOnCheckAppUpdate(false);
  };

  const handleAppDownload = async () => {
    setOnAppDownload(true);
    try {
      // kill the backend
      await invoke<string>('kill_backend');
      // backup the database
      await invoke<string>('pre_backup');
      await installUpdate();
    } catch (e) {
      toast.error(`更新时出现错误 ${e}`);
    }
    setOnAppDownload(false);
  };

  const handleCheckAssetsUpdate = async (download: boolean) => {
    setOnAssertUpdate(true);
    setFilesToUpdate([]);
    setErrors([]);

    try {
      const response = await invoke<string>('check_asserts_update', { download: download });
      const assertUpdateCheckResponse: AssertUpdateCheckResponse = JSON.parse(response);

      if (assertUpdateCheckResponse.errors && assertUpdateCheckResponse.errors.length > 0) {
        setErrors(assertUpdateCheckResponse.errors);
      } else if (assertUpdateCheckResponse.update_needed) {
        setFilesToUpdate(assertUpdateCheckResponse.files || []);
      } else if (!download) {
        toast.success('资源已是最新版本');
      } else {
        toast.success('资源更新完成, 请重启软件以加载最新资源');
      }

    } catch (e) {
      toast.error(`获取资源时出现错误 ${e}`);
    }

    setOnAssertUpdate(false);
  };

  const handlePreviewMousePosition = () => {
    const mouseX = appConfig.discardIconX;
    const mouseY = appConfig.discardIconY;

    if (mouseX === null || mouseY === null) {
      toast.error('请先填写鼠标位置');
      return;
    }

    mousePosition.mutate({
      mouse_x: mouseX,
      mouse_y: mouseY,
    }, {
      onError: e => {
        toast.error(`预览鼠标位置失败, 请重试, ${e.message}`);
      },
    });

  };


  return <div className="flex flex-col gap-4">
    <div className="text-center text-gray-600">
      HSR Scanner是一个开源的崩坏：星穹铁道遗器扫描工具，用来帮助玩家更好的清理遗器。
    </div>
    <div className="flex justify-center items-center gap-4">
      <Button
        size="sm"
        as={Link}
        color="primary"
        showAnchorIcon
        onPress={async () => {
          await open('https://github.com/mumawQAQ/hsr-scanner');
        }}
      >
        Github
      </Button>
      <Button size="sm" as={Link} color="primary" showAnchorIcon isDisabled>
        提交Bug (开发中)
      </Button>
      <Button size="sm" as={Link} color="primary" showAnchorIcon isDisabled>
        提交功能建议 (开发中)
      </Button>
    </div>

    <div className="text-medium font-semibold">
      自动扫描
    </div>
    <Card className="py-5 px-2" shadow="sm" radius="sm">
      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-row items-center">
          <div className="grow flex flex-col gap-2">
            <div>
              自动识别丢弃图标
            </div>
            <div className="text-sm text-gray-500">
              如果该选择开启则会使用yolo模型自动检测丢弃图标位置，如果检测失败可能导致无法自动标记，可以关闭此选项并手动设置图标位置
            </div>
          </div>


          <div className="ml-20">
            <Switch
              size={'sm'}
              isSelected={appConfig.autoScanDetectDiscardIcon}
              onValueChange={appConfig.setAutoScanDetectDiscardIcon}
            />
          </div>
        </div>

        <Divider />
        <div className="font-bold">
          手动设置丢弃图标位置
        </div>

        <div className="flex flex-row items-center">
          <div className="grow">
            丢弃图标x坐标
          </div>


          <div className="ml-20">
            <Input
              size="sm"
              type="number"
              value={
                appConfig.discardIconX === null ? '0' : appConfig.discardIconX.toString()
              }
              onValueChange={
                (value) => {
                  if (value === '') {
                    appConfig.setDiscardIconX(null);
                  } else {
                    appConfig.setDiscardIconX(parseInt(value));
                  }
                }
              }
              min={0}
              max={10000}
            />
          </div>
        </div>

        <div className="flex flex-row items-center">
          <div className="grow">
            丢弃图标y坐标
          </div>


          <div className="ml-20">
            <Input
              size="sm"
              type="number"
              value={
                appConfig.discardIconY === null ? '0' : appConfig.discardIconY.toString()
              }
              onValueChange={
                (value) => {
                  if (value === '') {
                    appConfig.setDiscardIconY(null);
                  } else {
                    appConfig.setDiscardIconY(parseInt(value));
                  }
                }
              }
              min={0}
              max={10000}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="solid" onPress={handlePreviewMousePosition}>
            预览位置
          </Button>
        </div>
      </CardBody>
    </Card>

    <Card className="py-5 px-2" shadow="sm" radius="sm">
      <CardBody className="flex flex-row gap-2 items-center">
        <div className="grow flex flex-col gap-2">
          <div>
            丢弃分数
          </div>
          <div className="text-sm text-gray-500">
            如果分数小于该值则会自动标记
          </div>
        </div>


        <div className="ml-20">
          <Input
            size="sm"
            type="number"
            value={
              appConfig.autoScanConfigDiscardScore === null ? '0' : appConfig.autoScanConfigDiscardScore.toString()
            }
            onValueChange={
              (value) => {
                if (value === '') {
                  appConfig.setAutoScanConfigDiscardScore(0);
                } else {
                  appConfig.setAutoScanConfigDiscardScore(parseInt(value));
                }
              }
            }
            min={0}
            max={100}
          />
        </div>
      </CardBody>
    </Card>


    <div className="text-medium font-semibold">
      识别区域
    </div>
    <Card className="py-5 px-2" shadow="sm" radius="sm">
      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-row items-center">
          <div className="grow flex flex-col gap-2">
            <div>
              自动识别遗器属性/名称位置
            </div>
            <div className="text-sm text-gray-500">
              如果该选择开启则会使用yolo模型自动检测遗器主属性，副属性，名称位置，如果检测失败可能导致ocr错误，可以关闭此选项并手动设置位置
            </div>
          </div>


          <div className="ml-20">
            <Switch
              size={'sm'}
            />
          </div>
        </div>
        <Divider />

        <div>
          <div className="font-bold">
            手动设置遗器名称位置
          </div>
          <div className="text-sm text-gray-500">
            在点击预览位置/生成位置之前请保证游戏打开，语言选择英语，并且在遗器背包界面
          </div>

        </div>

        <BoxSetting name={'relic_title'} />
        <BoxSetting name={'relic_main_stat'} />
        <BoxSetting name={'relic_sub_stat'} />
      </CardBody>
    </Card>


    <div className="text-medium font-semibold">
      版本 & 更新
    </div>
    <Card className="py-5 px-2" shadow="sm" radius="sm">
      <CardBody className="flex flex-row gap-2 items-center">
        <RefreshCcw />
        <div className="grow">
          当前版本：{version ?? '未知'}
        </div>


        <Button size="md" variant="flat" onPress={handleCheckAppUpdate} isDisabled={onCheckAppUpdate}>
          检查软件更新
        </Button>
      </CardBody>
    </Card>

    {
      manifest && <Card className="py-3 px-2 bg-green-400" shadow="sm" radius="sm">
        <CardBody className="flex flex-row items-center">
          <div className="flex flex-col gap-2 grow">
            <div className="text-medium font-semibold">
              发现新版本 {manifest.version}
            </div>
            <div>
              {manifest.body}
            </div>
          </div>
          <Button size="md" variant="solid" color="danger" onPress={handleAppDownload} isDisabled={onAppDownload}>
            {onAppDownload ? '更新中...' : '更新'}
          </Button>
        </CardBody>
      </Card>
    }

    <Card className="py-5 px-2" shadow="sm" radius="sm">
      <CardBody className="flex flex-row gap-2 items-center">
        <RefreshCcw />
        <div className="grow">
          当前游戏资源版本：未知（开发中）
        </div>


        <Button size="md" variant="flat" onPress={() => handleCheckAssetsUpdate(false)} isDisabled={onAssertUpdate}>
          检查资源更新
        </Button>
      </CardBody>
    </Card>

    {
      filesToUpdate.length > 0 && <Card className="py-3 px-2 bg-green-400" shadow="sm" radius="sm">
        <CardBody className="flex flex-row items-center">
          <div className="flex flex-col gap-2 grow">
            <div className="text-medium font-semibold">
              发现新资源
            </div>
            <div>
              <ul>
                {filesToUpdate.map((file) => <li key={file}>{file}</li>)}
              </ul>
            </div>
          </div>
          <Button
            size="md"
            variant="solid"
            color="danger"
            onPress={
              () => handleCheckAssetsUpdate(true)
            } isDisabled={onAppDownload}>
            {onAssertUpdate ? '更新中...' : '更新'}
          </Button>
        </CardBody>
      </Card>
    }

    {
      errors.length > 0 && <Card className="py-3 px-2 bg-red-900 text-white" shadow="sm" radius="sm">
        <CardBody className="flex flex-col gap-2">
          <div className="text-medium font-semibold">
            获取资源时出现错误
          </div>
          <div>
            <ul>
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        </CardBody>
      </Card>
    }
  </div>;
}