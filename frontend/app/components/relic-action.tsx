'use client';
import { Switch } from '@nextui-org/switch';
import { FileLock, ListEnd, PanelTop, PictureInPicture, ScanEye, Workflow } from 'lucide-react';
import { Button } from '@nextui-org/button';
import useWindowStore from '@/app/hooks/use-window-store';
import { useModal } from '@/app/hooks/use-modal-store';
import { useUpdateFullLogState } from '@/app/apis/state';
import { invoke } from '@tauri-apps/api/tauri';
import { useStartPipeline, useStopPipeline } from '@/app/apis/pipeline';
import {
  useAnalysisFailSkip,
  useAutoDetectDiscardIcon,
  useAutoDetectRelicBoxPosition,
  useDiscardIconPosition,
  useRelicBoxPosition,
  useRelicDiscardScore,
} from '@/app/apis/config';

export default function RelicAction() {
  const {
    singleRelicAnalysisId,
    setSingleRelicAnalysisId,
    autoRelicAnalysisId,
    setAutoRelicAnalysisId,
    logPause,
    setLogPause,
    fullLog,
    setFullLog,
    topWindow,
    setTopWindow,
    isLightMode,
    setIsLightMode,
  } = useWindowStore();
  const { onOpen } = useModal();

  const { mutate: updateFullLogState } = useUpdateFullLogState();
  const startPipeline = useStartPipeline();
  const stopPipeline = useStopPipeline();
  const discardIconPosition = useDiscardIconPosition();
  const analysisFailSkip = useAnalysisFailSkip();
  const relicDiscardScore = useRelicDiscardScore();
  const autoDetectDiscardIcon = useAutoDetectDiscardIcon();
  const autoDetectRelicBoxPosition = useAutoDetectRelicBoxPosition();
  const relicTitleBoxPosition = useRelicBoxPosition('relic_title');
  const relicMainStatBoxPosition = useRelicBoxPosition('relic_main_stat');
  const relicSubStatBoxPosition = useRelicBoxPosition('relic_sub_stat');


  const handleScanStateChange = async (status: boolean) => {
    if (status) {
      startPipeline.mutate({
        pipeline_name: 'SingleRelicAnalysisPipeline',
        meta_data: {
          auto_detect_relic_box_position: autoDetectRelicBoxPosition.data,
          relic_title_box: {
            x: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.x : 0,
            y: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.y : 0,
            w: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.w : 0,
            h: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.h : 0,
          },
          relic_main_stat_box: {
            x: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.x : 0,
            y: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.y : 0,
            w: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.w : 0,
            h: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.h : 0,
          },
          relic_sub_stat_box: {
            x: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.x : 0,
            y: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.y : 0,
            w: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.w : 0,
            h: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.h : 0,
          },
        },
      }, {
        onSuccess: (data) => {
          setSingleRelicAnalysisId(data.pipeline_id);
        },
      });
    } else {
      stopPipeline.mutate(singleRelicAnalysisId, {
        onSuccess: () => {
          setSingleRelicAnalysisId(null);
        },
      });
    }
  };

  const handleFullLogChange = async (status: boolean) => {
    updateFullLogState(status, {
      onSuccess: () => {
        setFullLog(status);
      },
    });
  };

  const handleSelectTemplate = () => {
    onOpen('select-template');
  };

  const handleSetTopWindow = async (status: boolean) => {
    try {
      await invoke('set_always_on_top', { status });
      setTopWindow(status);
    } catch (error) {
      console.error('Failed to set window top status:', error);
    }
  };

  const handleSetLightMode = async (mode: boolean) => {
    try {
      await invoke('set_window_size', { status: mode });
      setIsLightMode(mode);
    } catch (error) {
      console.error('Failed to set light mode:', error);
    }
  };


  const handleAutoScanStateChange = async (status: boolean) => {
    if (status) {
      startPipeline.mutate({
        pipeline_name: 'AutoRelicAnalysisPipeline',
        meta_data: {
          analysis_fail_skip: analysisFailSkip.data,
          relic_discard_score: relicDiscardScore.data ? relicDiscardScore.data : 40,

          auto_detect_discard_icon: autoDetectDiscardIcon.data,
          discard_icon_x: discardIconPosition.data ? discardIconPosition.data.value.x : 0,
          discard_icon_y: discardIconPosition.data ? discardIconPosition.data.value.y : 0,

          auto_detect_relic_box_position: autoDetectRelicBoxPosition.data,
          relic_title_box: {
            x: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.x : 0,
            y: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.y : 0,
            w: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.w : 0,
            h: relicTitleBoxPosition.data ? relicTitleBoxPosition.data.value.h : 0,
          },
          relic_main_stat_box: {
            x: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.x : 0,
            y: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.y : 0,
            w: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.w : 0,
            h: relicMainStatBoxPosition.data ? relicMainStatBoxPosition.data.value.h : 0,
          },
          relic_sub_stat_box: {
            x: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.x : 0,
            y: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.y : 0,
            w: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.w : 0,
            h: relicSubStatBoxPosition.data ? relicSubStatBoxPosition.data.value.h : 0,
          },
        },
      }, {
        onSuccess: (data) => {
          setAutoRelicAnalysisId(data.pipeline_id);
        },
      });
    } else {
      stopPipeline.mutate(autoRelicAnalysisId, {
        onSuccess: () => {
          setAutoRelicAnalysisId(null);
        },
      });
    }
  };

  return (
    <div className="flex flex-row gap-4 md:flex-col">
      <Switch color="success" size={isLightMode ? 'sm' : 'md'} thumbIcon={<PanelTop />} isSelected={topWindow}
              onValueChange={handleSetTopWindow}>
        窗口置顶
      </Switch>
      <Switch color="success" size={isLightMode ? 'sm' : 'md'} thumbIcon={<PictureInPicture />} isSelected={isLightMode}
              onValueChange={handleSetLightMode}>
        小屏模式
      </Switch>
      <Switch color="success" size={isLightMode ? 'sm' : 'md'} thumbIcon={<ScanEye />}
              isSelected={singleRelicAnalysisId !== null}
              onValueChange={handleScanStateChange}>
        手动扫描
      </Switch>
      <Switch color="success" size={isLightMode ? 'sm' : 'md'} thumbIcon={<Workflow />}
              isSelected={autoRelicAnalysisId !== null}
              onValueChange={handleAutoScanStateChange}>
        自动扫描
      </Switch>
      <Switch color="success" thumbIcon={<FileLock />} isSelected={fullLog} onValueChange={handleFullLogChange}
              className="hidden md:block">
        全部日志
      </Switch>
      <Switch color="success" thumbIcon={<ListEnd />} isSelected={logPause} onValueChange={setLogPause}
              className="hidden md:block">
        跟随底部
      </Switch>
      <Button size="sm" variant="bordered" className="mt-5 hidden md:block" onPress={handleSelectTemplate}>
        选择模板
      </Button>
    </div>
  );
}
