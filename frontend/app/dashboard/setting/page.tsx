'use client';

import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/react';
import { open } from '@tauri-apps/api/shell';

export default function Setting() {
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
  </div>;
}