

export class Command { // 命令封装
    // 音视频分离
    splitAudio(path, videoName, format) {
        const audioPath = Command.genVideoAAC(path, videoName);
        const videoPath = `${path}${videoName}.${format}`;
        return {
            commands: ['-v', 'quiet', '-i', videoPath, '-acodec', 'copy', '-vn', audioPath],
            videoPath,
            audioPath,
            audioName: Command.genVideoAAC('', videoName)
        };
    }
    // 音频合并
    mergeAudio(pathConfig, trackStart, trackList, trackAttrMap) {
        const inputFiles = [];
        const filters = [];
        const filterSort = [];
        const { resourcePath, audioPath } = pathConfig;
        const outPath = `${audioPath}/audio.mp3`;
        let fileIndex = 0;
        trackList.forEach((trackItem, index) => {
            if (trackAttrMap[trackItem.id] && !trackAttrMap[trackItem.id].silent) {
                const { name, format, start, end, offsetL, offsetR } = trackItem ;
                let filterTag = `${fileIndex}`;
                if (offsetL > 0 || offsetR > 0) {
                    const clipS = (offsetL / 30).toFixed(2);
                    const clipE = ((end - start + offsetL) / 30).toFixed(2);
                    filters.push(`[${filterTag}]atrim=${clipS}:${clipE}[a${filterTag}]`);
                    filterTag = `a${fileIndex}`;
                }
                const delay = Math.floor((start - trackStart) / 30 * 1000);
                const resourceFile = `${resourcePath}${name}.${format}`;
                inputFiles.push('-i', resourceFile);
                filters.push(`[${filterTag}]adelay=${delay}|${delay}[s${fileIndex}]`);
                filterSort.push(`[s${fileIndex}]`);
                fileIndex++;
            }
        });
        filters.push(filterSort.join(''));
        const filterComplex = `${filters.join(';')}amix=inputs=${filterSort.length}:duration=longest:dropout_transition=0`;
        return {
            commands: [...inputFiles, '-filter_complex', filterComplex, '-f', 'mp3', `${outPath}`]
        };
    }
    // 视频抽帧
    genFrame(filePath, framePath, size, format = 'video', fps = 30) {
        if (format === 'gif') {
            const fileName = '/gif-%d.png';
            return {
                commands: ['-i', filePath, '-s', `${size.w}x${size.h}`, '-vf', 'colorkey=white:0.01:0.0', `${framePath}${fileName}`]
            };
        } else {
            const fileName = '/pic-%d.jpg';
            return {
                commands: ['-i', filePath, '-vf', `fps=${fps}`, '-s', `${size.w}x${size.h}`, `${framePath}${fileName}`]
            };
        }
    }
    // 指定开始结束时间抽帧
    genPlayFrame(videoPath, framePath, size, time, fps = 30) {
        const fileName = `/pic-${time}-%d.jpg`;
        return {
            commands: ['-ss', `${time}`, '-i', videoPath, '-ss', `0`, '-t', `${1}`, '-vf', `fps=${fps}`, '-s', `${size.w}x${size.h}`, `${framePath}${fileName}`]
        };
    }
    // 抽取指定帧数
    genPlayIFrame(videoPath, framePath, size, start) {
        const fileName = `/pic.jpg`;
        return {
            commands: ['-i', videoPath, '-vf', `select=eq(n\\,${start})`, '-s', `${size.w}x${size.h}`, '-vframes', `1`, `${framePath}${fileName}`]
        };
    }
    // 生成音频wave
    genWave(audioPath, videoName, wavePath, frameCount) {
        const fileName = `${videoName}.png`;
        return {
            commands: ['-i', audioPath, '-filter_complex', `aformat=channel_layouts=mono,compand,showwavespic=s=${frameCount * 5}x32:colors=yellow`, '-frames:v', '1', `${wavePath}${fileName}`],
            fileName
        };
    }
    static genVideoAAC(path, videoName) {
        return `${path}${videoName}_A.aac`;
    }
}