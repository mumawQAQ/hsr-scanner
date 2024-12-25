import argparse

import cv2
import json
import numpy as np
import pygetwindow as gw
from mss import mss
from mss.exception import ScreenShotError
from pydantic import BaseModel
from typing import List, Optional, Tuple




class Rectangle(BaseModel):
    x: float
    y: float
    w: float
    h: float



class ScreenAnnotator:
    def __init__(self, window_title: List[str],  display_only: bool, rectangles: Optional[List[Rectangle]] = None):
        self.window_title = window_title
        self.rectangles: List[Rectangle] = rectangles or []
        self.drawing = False
        self.start_point: Tuple[int, int] = (-1, -1)
        self.current_img: Optional[np.ndarray] = None
        self.original_img: Optional[np.ndarray] = None
        self.display_img: Optional[np.ndarray] = None
        self.window_info: Optional[dict] = None
        self.display_only = display_only


    @staticmethod
    def _output(message: json):
        """
        Output a message to the console.
        status = error | success
        message = string exist only when status = error
        data = json string exist only when status = success
        """
        print(json.dumps(message, ensure_ascii=False))


    def find_window(self) -> bool:
        """Find and activate the target window."""
        windows = None
        for title in self.window_title:
            windows = gw.getWindowsWithTitle(title)
            if windows:
                break

        if not windows:
            self._output({
                "status": "error",
                "message": f"无法找到目标窗口 ${self.window_title}"
            })
            return False

        target_window = windows[0]

        # Apply scaling factor to window coordinates
        self.window_info = {
            'left': int(target_window.left ),
            'top': int(target_window.top),
            'width': int(target_window.width ),
            'height': int(target_window.height )
        }

        # Validate window dimensions
        if self.window_info['width'] <= 0 or self.window_info['height'] <= 0:
            self._output({
                "status": "error",
                "message": "窗口尺寸无效"
            })
            return False

        return True

    def capture_screenshot(self) -> bool:
        """Capture screenshot of the target window."""
        if not self.window_info:
            return False

        try:
            with mss() as sct:
                sct_img = sct.grab(self.window_info)
                temp_img = np.array(sct_img)

                # Validate image dimensions
                if temp_img.size == 0 or temp_img.shape[0] == 0 or temp_img.shape[1] == 0:
                    self._output({
                        "status": "error",
                        "message": "截图尺寸无效"
                    })
                    return False

                self.original_img = cv2.cvtColor(temp_img, cv2.COLOR_BGRA2BGR)
                self.display_img = self.original_img.copy()
                return True
        except ScreenShotError as e:
            self._output({
                "status": "error",
                "message": f"截图时出错: {e}"
            })
            return False
        except Exception as e:
            self._output({
                "status": "error",
                "message": f"截图时出错: {e}"
            })
            return False

    def _validate_image(self, img: Optional[np.ndarray]) -> bool:
        """Validate if an image is valid for operations."""
        if img is None:
            self._output({
                "status": "error",
                "message": f"图像为空"
            })
            return False
        if img.size == 0 or img.shape[0] == 0 or img.shape[1] == 0:
            self._output({
                "status": "error",
                "message": f"图像尺寸无效"
            })
            return False
        return True

    def _get_display_image(self) -> Optional[np.ndarray]:
        """Get the current image to display."""
        if self.drawing and self._validate_image(self.current_img):
            return self.current_img
        elif self._validate_image(self.display_img):
            return self.display_img
        return None

    def draw_rectangle_callback(self, event: int, x: int, y: int, flags: None, param: None ) -> None:
        """Handle mouse events for drawing rectangles."""
        if not self.window_info:
            return

        if event == cv2.EVENT_LBUTTONDOWN:
            if not self._validate_image(self.display_img):
                return
            self.drawing = True
            self.start_point = (x, y)
            self.current_img = self.display_img.copy()

        elif event == cv2.EVENT_MOUSEMOVE and self.drawing:
            if not self._validate_image(self.display_img):
                return
            self.current_img = self.display_img.copy()
            end_point = self._constrain_point(x, y)
            self._draw_preview_rectangle(end_point)

        elif event == cv2.EVENT_LBUTTONUP and self.drawing:
            self.drawing = False
            if not self._validate_image(self.display_img):
                return
            end_point = self._constrain_point(x, y)
            self._finalize_rectangle(end_point)

    def _constrain_point(self, x: int, y: int) -> Tuple[int, int]:
        """Constrain coordinates to window boundaries."""
        if not self.window_info:
            return 0, 0
        return (
            max(0, min(x, self.window_info['width'] - 1)),
            max(0, min(y, self.window_info['height'] - 1))
        )

    def _draw_preview_rectangle(self, end_point: Tuple[int, int]) -> None:
        """Draw preview rectangle and existing rectangles."""
        if not self._validate_image(self.current_img):
            return

        cv2.rectangle(self.current_img, self.start_point, end_point, (255, 0, 0), 1)
        for rect in self.rectangles:
            self._draw_rectangle(self.current_img, rect)

    def _finalize_rectangle(self, end_point: Tuple[int, int]) -> None:
        """Finalize rectangle drawing and add to collection."""
        if not self._validate_image(self.display_img):
            return

        x = min(self.start_point[0], end_point[0])
        y = min(self.start_point[1], end_point[1])
        w = abs(end_point[0] - self.start_point[0])
        h = abs(end_point[1] - self.start_point[1])
        minimum_w = 1
        minimum_h = 1

        if w > minimum_w and h > minimum_h:
            new_rect = Rectangle(x=x, y=y, w=w, h=h)
            self.rectangles.pop()
            self.rectangles.append(new_rect)

            self.display_img = self.original_img.copy()
            for rect in self.rectangles:
                self._draw_rectangle(self.display_img, rect)
            self.current_img = None
            self._output({
                "status": "success",
                "data": new_rect.model_dump_json()
            })

    @staticmethod
    def _draw_rectangle(img: np.ndarray, rect: Rectangle) -> None:
        """Draw a single rectangle on the image."""
        cv2.rectangle(
            img,
            (int(rect.x), int(rect.y)),
            (int(rect.x + rect.w), int(rect.y + rect.h)),
            (255, 0, 0),
            1
        )

    def run(self) -> None:
        """Main application loop."""
        canvas_name = "HSR canvas previewer"
        if not self.find_window() or not self.capture_screenshot():
            return

        cv2.namedWindow(canvas_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(canvas_name, 1280 , 1024)

        # before start, draw all the existing rectangles
        for rect in self.rectangles:
            self._draw_rectangle(self.display_img, rect)


        if not self.display_only:
            cv2.setMouseCallback(canvas_name, lambda *args: self.draw_rectangle_callback(*args))

        while True:
            display = self._get_display_image()

            # check if the window is closed
            if cv2.getWindowProperty(canvas_name, cv2.WND_PROP_VISIBLE) < 1:
                break

            if display is not None:
                cv2.imshow(canvas_name, display)

            cv2.waitKey(1)

        cv2.destroyAllWindows()


def main():
    """Main function."""
    parser = argparse.ArgumentParser(description="HSR canvas previewer")
    parser.add_argument('--x', nargs='+', type=float, help='X coordinates of the rectangles')
    parser.add_argument('--y', nargs='+', type=float, help='Y coordinates of the rectangles')
    parser.add_argument('--w', nargs='+', type=float, help='Widths of the rectangles')
    parser.add_argument('--h', nargs='+', type=float, help='Heights of the rectangles')
    parser.add_argument('--display_only', action='store_true', help='Only display the existing rectangles')
    args = parser.parse_args()


    rectangles = []
    if args.x and args.y and args.w and args.h:
        for x, y, w, h in zip(args.x, args.y, args.w, args.h):
            rectangles.append(Rectangle(x=x, y=y, w=w, h=h))

    annotator = ScreenAnnotator(["Honkai: Star Rail"], args.display_only, rectangles)
    annotator.run()


if __name__ == "__main__":
    main()