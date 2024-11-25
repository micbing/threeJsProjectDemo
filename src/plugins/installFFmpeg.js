import FFManager from '../utils/ffmpegManager';

const installFFmpeg = {
    install(app) {
        // 注册全局ffmpeg接口
        const ffmpegIns = new FFManager({
            Hooks: {
                beforeInit: () => {
                    // app.config.globalProperties.$ElLoading.visible.value = true;
                    console.log('ffmpeg开始初始化')
                },
                afterInit: () => {
                    // app.config.globalProperties.$ElLoading.visible.value = false;
                       console.log('ffmpeg初始化完成')
                }
            }
        });
        ffmpegIns.init();
        app.provide('ffmpeg', ffmpegIns);
        console.log(ffmpegIns);
    }
};
export default installFFmpeg;