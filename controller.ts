import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'
import path from 'node:path'
import {
	HLS_PATH,
	HLS_FRAGMENTS_PATH,
	RTSP_URL,
	HLS_PLAYLIST_PATH,
} from './config.ts'
if (!fs.existsSync(HLS_PATH)) {
	fs.mkdirSync(HLS_PATH), { recursive: true }
}
if (!fs.existsSync(HLS_FRAGMENTS_PATH)) {
	fs.mkdirSync(HLS_FRAGMENTS_PATH), { recursive: true }
}
export function converter(RTSP_URL: string, noAudio = true) {
	const ffmpegCommand = ffmpeg()
		.input(RTSP_URL)
		.inputOptions([
			'-hide_banner',
			'-rtsp_transport tcp',
			'-use_wallclock_as_timestamps 1',
			'-fflags +genpts',
			'-fflags discardcorrupt',
			'-loglevel debug',
			'-flags low_delay',
			'-fflags latm',
			'-fflags nobuffer',
		])
		.outputOption(
			'-hls_segment_filename',
			path.join(HLS_FRAGMENTS_PATH, 'data%03d.ts')
		)
		.toFormat('hls')
		.outputOptions([
			'-c:v libx264',
			'-preset ultrafast',
			'-tune zerolatency',
			'-skip_frame no_skip',
			'-hls_flags delete_segments+temp_file',
			'-hls_time 10',
			'-g 75',
			'-keyint_min 75',
		])
		.output(HLS_PLAYLIST_PATH)
		.on('start', (cmd) => console.log('FFmpeg command:', cmd))
		.on('stderr', (line) => {
			console.log(line)
		})
		.on('error', (err) => console.error('FFmpeg error:', err))
		.on('progress', (prog) => console.log('Progress:', prog))
		.on('end', () => console.log('Stream ended'))
	if (noAudio) {
		ffmpegCommand.audioCodec('aac')
		ffmpegCommand.audioChannels(2)
	} else {
		ffmpegCommand.noAudio()
	}
	ffmpegCommand.run()
}
