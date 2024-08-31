import cv2
import numpy as np

white_lower = np.array([0, 0, 0])
white_upper = np.array([179, 255, 255])
orange_lower = np.array([16, 3, 73])
orange_upper = np.array([67, 255, 255])


def pp_img(img, lower, upper):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    mask = cv2.inRange(hsv, lower, upper)
    result = cv2.bitwise_and(grey, grey, mask=mask)

    denoised = cv2.medianBlur(result, 1)
    _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return binary


def pp_relic_title_img(img, x1, y1, x2, y2):
    relic_title_area = img[y1:y2, x1:x2]
    return pp_img(relic_title_area, orange_lower, orange_upper)


def pp_relic_main_img(img, x1, y1, x2, y2):
    relic_main_area = img[y1:y2, x1:x2]
    # split the main stat area in to name and value areas
    main_stat_name_area = relic_main_area[:, : int(relic_main_area.shape[1] * 0.7)]
    main_stat_val_area = relic_main_area[:, int(relic_main_area.shape[1] * 0.7):]

    return pp_img(main_stat_name_area, orange_lower, orange_upper), pp_img(main_stat_val_area, orange_lower,
                                                                           orange_upper)


def pp_relic_sub_img(img, x1, y1, x2, y2):
    sub_stat_area = img[y1:y2, x1:x2]
    # split the sub stat area in to name and value areas
    sub_stat_names_area = sub_stat_area[:, : int(sub_stat_area.shape[1] * 0.8)]
    sub_stat_vals_area = sub_stat_area[:, int(sub_stat_area.shape[1] * 0.8):]

    return pp_img(sub_stat_names_area, white_lower, white_upper), pp_img(sub_stat_vals_area, white_lower, white_upper)
