import asyncio

import cv2
import numpy as np
import pyautogui as pg
import pygetwindow as gw

from app.dependencies.global_state import GlobalState
from app.logging_config import logging

possible_titles = ['Honkai: Star Rail']  # TODO: support '崩坏：星穹铁道'


async def get_screen_shot(global_state: GlobalState):
    while True:
        game_window = None

        for title in possible_titles:
            windows = gw.getWindowsWithTitle(title)
            if windows:
                game_window = windows[0]
                break

        if not game_window:
            logging.error("未检测到游戏窗口")
            await asyncio.sleep(global_state.interval / 1000)
            continue

        screen = pg.screenshot(region=(game_window.left, game_window.top, game_window.width, game_window.height))
        global_state.screen = screen
        screen_np = np.array(screen)
        global_state.screen_rgb = cv2.cvtColor(screen_np, cv2.COLOR_BGR2RGB)
        global_state.window = {
            'left': game_window.left,
            'top': game_window.top,
            'width': game_window.width,
            'height': game_window.height
        }

        logging.info(f"截图成功: {global_state.window}")

        await asyncio.sleep(global_state.interval / 1000)
