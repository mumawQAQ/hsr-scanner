# HSR-Scanner

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=mumawQAQ_hsr-scanner&metric=bugs)](https://sonarcloud.io/summary/new_code?id=mumawQAQ_hsr-scanner)

本项目旨在提供一个简单易用的崩铁遗器强化/丢弃方案，帮助大家更方便的整理遗器。

## 使用须知

1. 本项目仅供学习交流使用，不得用于商业用途。
2. 默认提供的配置仅供参考，不保证其准确性。 如需使用，请自行修改配置。

## 安装

1. 从https://mumas.org/public/hsr-scanner/install 中下载最新版本的安装包

## 使用方法

1. 由于项目使用的是英文OCR，所以请确保你的游戏语言设置为英文
2. 确保你的游戏窗口在背包里的遗器界面或舍弃遗器界面
3. 保证你的背景尽量不包括橙色或白色
4. 使用管理员权限运行程序并点击开始扫描按钮

## 使用及安装常见问题

1. 为什么安装依赖失败？如果你遇到以下界面：
   **请确保你的安装路径里没有中文**
   ![AFAC8942CF6CB3E0CF78C3ADAF9FC2CD](https://github.com/user-attachments/assets/63a78d2d-1b31-4183-84b2-5142e9bce641)
2. 为什么没有检测到游戏窗口？如果你遇到以下界面
   **请确保你的游戏语言设置为了英语**
   ![73A7DEAFDEFB74E65CFBAFCB3629EE48](https://github.com/user-attachments/assets/fe03c732-bfc7-4003-ac47-6dcc411a54dc)
3. 为什么没有检查到副属性或者主属性:
   **请打开显示图片，并查看图片是否有干扰，如果图片呈现干扰，则说明你的背景里有橙色或者白色，请切换背景以后再试试**

## 开发方式

1. 确保你有node和pnpm环境以及tauri环境
   tauri的配置方式参考(https://v2.tauri.app/start/)
2. 运行下面的代码
```
pnpm install
npm run tauri dev
```

### 开发常见问题

1. 尽量使用软件的关闭按钮关闭，以确保backend进程被正确关闭，如果遇到npm run tauri dev无法启动的情况，请确保后台所有占用软件文件的python进程关闭

## 本项目使用到的技术

1. tauri用于桌面端的开发以及打包(https://tauri.app/)
2. fastapi用于后端数据与前端数据的交互(https://fastapi.tiangolo.com/)
3. yolov8用于主属性，副属性，遗器标题的位置捕捉，以适配不同的屏幕分辨率(https://github.com/ultralytics/ultralytics)
4. paddelocr和rapidfuzz用于ocr以及对识别错误的文本进行fuzz修正
5. sqlite用于遗器模板的持久化储存

## 强化概率统计过程

详细的强化概率统计过程文档请参见 [Statistics.md](Statistics.md)。


## 潜力值/适配度计算逻辑

![f661dfb1-3944-4038-8610-c081021724bc](https://github.com/user-attachments/assets/0f46e4cd-517a-499e-a273-553f2acf872a)


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=mumawQAQ/hsr-scanner&type=Date)](https://star-history.com/#mumawQAQ/hsr-scanner&Date)

