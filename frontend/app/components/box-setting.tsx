'use client';
import React, { useEffect } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

type BoxSettingProps = {
  name: string,
};

const BoxSetting = ({ name }: BoxSettingProps) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [w, setW] = React.useState(0);
  const [h, setH] = React.useState(0);

  useEffect(() => {
    if (isGenerating) {
      // Start the backend and set up listeners
      const startAndListen = async () => {
        try {
          // Listen for 'backend-log' events
          const logUnlistener = await listen<string>('screen-annotator-log', event => {
            const result = JSON.parse(event.payload);
            if (result.status === 'success') {
              const box = JSON.parse(result.data);
              setX(box.x);
              setY(box.y);
              setW(box.w);
              setH(box.h);
            } else {
              toast.error(result.message);
            }
          });


          // Listen for 'backend-port' events
          const exitUnlistener = await listen('screen-annotator-exit', () => {
            console.log('screen-annotator-exit');
            setIsGenerating(false);
          });

          await invoke('start_backend'); // Start the backend process

          // Return cleanup function to remove event listeners
          return () => {
            logUnlistener();
            exitUnlistener();
          };
        } catch (e) {
          console.error('Error setting up listeners:', e);
          toast.error('监听生成位置脚本失败');
        }
      };

      // Call the async function and handle cleanup
      let cleanupFunc = () => {
      }; // Initialize cleanup function
      startAndListen().then(cleanup => {
        if (cleanup) cleanupFunc = cleanup;
      });

      // Cleanup listeners when component unmounts
      return () => {
        cleanupFunc();
      };

    }
  }, [isGenerating]);


  const handleGenerateBox = async () => {
    try {
      await invoke('start_screen_annotator', {
        displayOnly: false,
        x: [],
        y: [],
        w: [],
        h: [],
      });
      setIsGenerating(true);
    } catch (error) {
      console.error('Error calling generate position script:', error);
      toast.error('生成位置脚本调用失败');
    }
  };

  const handlePreviewBox = async () => {
    try {
      await invoke('start_screen_annotator', {
        displayOnly: true,
        x: [x],
        y: [y],
        w: [w],
        h: [h],
      });
    } catch (error) {
      console.error('Error calling generate position script:', error);
      toast.error('预览位置脚本调用失败');
    }
  };

  const handleStopGenerateBox = () => {
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-row items-center">
      <div className="grow">
        {name}
      </div>


      <div className="ml-20 flex flex-row gap-2 items-center">
        <Input
          size="sm"
          label="X"
          type="number"
          variant="underlined"
          min={0}
          value={x.toString()}
          max={10000}
        />
        <Input
          size="sm"
          label="Y"
          type="number"
          variant="underlined"
          value={y.toString()}
          min={0}
          max={10000}
        />
        <Input
          size="sm"
          label="W"
          type="number"
          variant="underlined"
          value={w.toString()}
          min={0}
          max={10000}
        />
        <Input
          size="sm"
          label="H"
          type="number"
          variant="underlined"
          value={h.toString()}
          min={0}
          max={10000}
        />
        {
          isGenerating ? (
            <Button size="sm" variant="flat" onClick={handleStopGenerateBox}>
              停止监听
            </Button>
          ) : (
            <Button size="sm" variant="flat" onClick={handleGenerateBox}>
              生成位置
            </Button>
          )
        }

        <Button size="sm" variant="flat" onClick={handlePreviewBox}>
          预览位置
        </Button>
      </div>
    </div>
  );
};

export default BoxSetting;